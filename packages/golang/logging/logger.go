package logging

import (
	"fmt"
	"os"
)

type (
	Logger interface {
		Debug(args ...interface{})
		Debugf(template string, args ...interface{})
		Info(args ...interface{})
		Infof(template string, args ...interface{})
		Warn(args ...interface{})
		Warnf(template string, args ...interface{})
		Error(args ...interface{})
		Errorf(template string, args ...interface{})
	}

	defaultLogger struct {
		level Level
		name  string
	}

	Level int8
)

func formatting(name, template string, args ...interface{}) string {
	tmp := fmt.Sprintf("%s:%s", name, template)
	return fmt.Sprintf(tmp, args...)
}

func (d *defaultLogger) Debug(args ...interface{}) {
	if d.level != DebugLevel {
		return
	}
	out := []interface{}{d.name}
	out = append(out, args...)
	fmt.Println(out...)
}

func (d *defaultLogger) Debugf(template string, args ...interface{}) {
	if d.level != DebugLevel {
		return
	}
	fmt.Println(formatting(d.name, template, args...))
}

func (d *defaultLogger) Info(args ...interface{}) {
	if d.level > InfoLevel {
		return
	}
	out := []interface{}{d.name}
	out = append(out, args...)
	fmt.Println(out...)
}

func (d *defaultLogger) Infof(template string, args ...interface{}) {
	if d.level > InfoLevel {
		return
	}
	fmt.Println(formatting(d.name, template, args...))
}

func (d *defaultLogger) Warn(args ...interface{}) {
	if d.level > WarnLevel {
		return
	}
	out := []interface{}{d.name}
	out = append(out, args...)
	fmt.Println(out...)
}

func (d *defaultLogger) Warnf(template string, args ...interface{}) {
	if d.level > WarnLevel {
		return
	}
	fmt.Println(formatting(d.name, template, args...))
}

func (d *defaultLogger) Error(args ...interface{}) {
	out := []interface{}{d.name}
	out = append(out, args...)
	fmt.Println(out...)
}

func (d *defaultLogger) Errorf(template string, args ...interface{}) {
	fmt.Println(formatting(d.name, template, args...))
}

const (
	DebugLevel Level = iota - 1
	InfoLevel
	WarnLevel
	ErrorLevel

	defaultLogName = "@viron/lib"
)

var logs map[string]Logger

func get(name string) (Logger, bool) {
	if len(logs) == 0 {
		logs = map[string]Logger{}
	}
	if l, exists := logs[name]; exists {
		return l, exists
	}
	l, exists := logs[defaultLogName]
	return l, exists
}

func GetDefaultLogger() Logger {
	level := DebugLevel
	if debug := os.Getenv("DEBUG"); debug == "" {
		level = InfoLevel
	}
	return GetLogger(defaultLogName, level)
}

func GetLogger(name string, level Level) Logger {
	if l, exists := get(name); exists {
		return l
	}
	var l Logger
	switch level {
	case DebugLevel:
		l = Debug(name)
	case InfoLevel:
		l = Info(name)
	case WarnLevel:
		l = Warn(name)
	case ErrorLevel:
		l = Error(name)
	}
	logs[name] = l
	return l
}

func Debug(name string) Logger {
	return &defaultLogger{
		level: DebugLevel,
		name:  name,
	}
}
func Info(name string) Logger {
	return &defaultLogger{
		level: InfoLevel,
		name:  name,
	}
}
func Warn(name string) Logger {
	return &defaultLogger{
		level: WarnLevel,
		name:  name,
	}
}
func Error(name string) Logger {
	return &defaultLogger{
		level: ErrorLevel,
		name:  name,
	}
}
