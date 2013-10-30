test( "hello test", function() {
  ok( 1 == "1", "Passed!" );
});

function saysHi(name) {
	return "Hi, " + name;
};

test('saysHi()', function() {
	equal(sayHi("Jack"), "Hi, Jack", "function outputs string correctly")

});