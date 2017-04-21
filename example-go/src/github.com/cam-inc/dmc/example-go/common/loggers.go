package common

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var loggersConfig map[string]zap.Config
var loggers map[string]*zap.Logger

func init() {
	loggers = make(map[string]*zap.Logger)
	loggersConfig = make(map[string]zap.Config)
	loggersConfig["default"] = zap.Config{
		Level: getLevel(zapcore.DebugLevel),
		Encoding: "json",
		EncoderConfig: zapcore.EncoderConfig{
			TimeKey:		"Time",
			LevelKey:	   "Level",
			NameKey:		"Name",
			CallerKey:	  "Caller",
			MessageKey:	 "Msg",
			StacktraceKey:  "St",
			EncodeLevel:	zapcore.CapitalLevelEncoder,
			EncodeTime:	 zapcore.ISO8601TimeEncoder,
			EncodeDuration: zapcore.StringDurationEncoder,
			EncodeCaller:   zapcore.ShortCallerEncoder,
		},
		OutputPaths:	  []string{"stdout"},
		ErrorOutputPaths: []string{"stderr"},
	}
	loggersConfig["audit"] = zap.Config{
		Level: getLevel(zapcore.DebugLevel),
		Encoding: "json",
		EncoderConfig: zapcore.EncoderConfig{
			TimeKey:		"Time",
			LevelKey:	   "Level",
			NameKey:		"Name",
			CallerKey:	  "Caller",
			MessageKey:	 "Msg",
			StacktraceKey:  "St",
			EncodeLevel:	zapcore.CapitalLevelEncoder,
			EncodeTime:	 zapcore.ISO8601TimeEncoder,
			EncodeDuration: zapcore.StringDurationEncoder,
			EncodeCaller:   zapcore.ShortCallerEncoder,
		},
		OutputPaths:	  []string{"stdout"},
		ErrorOutputPaths: []string{"stderr"},
	}
}

func GetLogger(name string) *zap.Logger {
	if loggers[name] != nil {
		return loggers[name]
	}
	logger, _ := loggersConfig[name].Build()
	loggers[name] = logger
	return logger
}

func getLevel(lvl zapcore.Level) zap.AtomicLevel {
	level := zap.NewAtomicLevel()
	level.SetLevel(lvl)
	return level
}
