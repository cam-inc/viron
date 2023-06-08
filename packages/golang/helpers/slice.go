package helpers

type StringSlice []string

func (s StringSlice) Contains(value string) bool {
	for _, v := range s {
		if v == value {
			return true
		}
	}
	return false
}
