package common

func InStringArray(val string, array []string) int {
	index := -1
	for i, v := range array {
		if val == v {
			return i
		}
	}
	return index
}
