package helpers

import "time"

func UnixToTime(unixTime int) time.Time {
	return time.Unix(int64(unixTime), int64(unixTime)%1000*1000000)
}
