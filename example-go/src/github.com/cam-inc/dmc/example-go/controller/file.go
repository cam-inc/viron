package controller

import (
	"encoding/base64"
	"path/filepath"

	"os"

	"github.com/cam-inc/dmc/example-go/common"
	"github.com/cam-inc/dmc/example-go/gen/app"
	"github.com/goadesign/goa"
	"go.uber.org/zap"
	"io/ioutil"
	"strconv"
)

// FileController implements the file resource.
type FileController struct {
	*goa.Controller
}

// NewFileController creates a file controller.
func NewFileController(service *goa.Service) *FileController {
	return &FileController{Controller: service.NewController("FileController")}
}

var statDir string

func init() {
	ex, _ := os.Executable()
	statDir = filepath.Dir(ex) + "/userstat/"
}

func getAbsPath(str string) string {
	path, _ := filepath.Abs(statDir + str)
	return path
}

// Upload runs the upload action.
func (c *FileController) Upload(ctx *app.UploadFileContext) error {
	// FileController_Upload: start_implement

	// Put your logic here
	logger := common.GetLogger("default")
	// ここではローカルにファイル保存するだけ。実際はS3などの配信サーバにあげるロジックが必要
	data, _ := base64.StdEncoding.DecodeString(*ctx.Payload.Data)
	outFile := getAbsPath(*ctx.Payload.Path)

	os.MkdirAll(filepath.Dir(outFile), 0755)
	file, err := os.Create(outFile)
	defer file.Close()

	if err != nil {
		logger.Error("File upload failure.", zap.Error(err))
		return ctx.InternalServerError()
	} else {
		file.Write(data)
		return ctx.NoContent()
	}
}

// Download runsthe donwload action.
func (c *FileController) Download(ctx *app.DownloadFileContext) error {
	// FileController_Download: start_implement

	// Put your logic here
	logger := common.GetLogger("default")
	// ここではローカルに存在するファイルを返すだけ。実際はS3などの配信サーバから取得するロジックが必要
	path := getAbsPath(ctx.Path)
	if _, err := os.Stat(path); err != nil {
		return ctx.BadRequest(err)
	}

	if data, err := ioutil.ReadFile(path); err != nil {
		logger.Error("File download failure.", zap.Error(err))
		return ctx.InternalServerError()
	} else {
		ctx.ResponseWriter.Header().Set("Content-Length", strconv.Itoa(len(data)))
		ctx.ResponseWriter.Header().Set("Content-Disposition", "attachment; filename=\""+filepath.Base(path)+"\"")
		return ctx.OK(data)
	}
}
