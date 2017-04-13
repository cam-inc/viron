package common

import "testing"

func TestString(t *testing.T) {
	rightStr := "Test"

	ret := String(rightStr)

	if *ret != rightStr {
		t.Errorf("%v and %v are different", *ret, rightStr)
	}
}

func TestStringValue(t *testing.T) {
	rightStr := "Test"
	rightStrPtr := &rightStr

	ret := StringValue(rightStrPtr)

	if ret != rightStr {
		t.Errorf("%v and %v are different", ret, rightStr)
	}

	retNil := StringValue(nil)

	if retNil != "" {
		t.Errorf("%v and \"\" are different", retNil)
	}
}

func TestBool(t *testing.T) {
	rightBool := true

	ret := Bool(rightBool)

	if *ret != rightBool {
		t.Errorf("%v and %v are different", *ret, rightBool)
	}
}

func TestBoolValue(t *testing.T) {
	rightBool := true
	rightBoolPtr := &rightBool

	ret := BoolValue(rightBoolPtr)

	if ret != rightBool {
		t.Errorf("%v and %v are different", ret, rightBool)
	}

	retNil := BoolValue(nil)

	if retNil != false {
		t.Errorf("%v and \"\" are different", retNil)
	}

}

func TestInt(t *testing.T) {
	rightInt := 10

	ret := Int(rightInt)

	if *ret != rightInt {
		t.Errorf("%v and %v are different", *ret, rightInt)
	}
}

func TestIntValue(t *testing.T) {
	rightInt := 10
	rightIntPtr := &rightInt

	ret := IntValue(rightIntPtr)

	if ret != rightInt {
		t.Errorf("%v and %v are different", ret, rightInt)
	}

	retNil := IntValue(nil)

	if retNil != 0 {
		t.Errorf("%v and \"\" are different", retNil)
	}
}
