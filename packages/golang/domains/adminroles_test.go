package domains

func setUpRole() {
	CasbinLoadIntervalMsec := int64(0)
	NewFile("./test_casbin", &CasbinLoadIntervalMsec)
}
