// functionalExtensions.js

// These functions are courtesy of Microsoft's Dorian Corompt.
// See http://blogs.msdn.com/b/doriancorompt/archive/2013/01/21/bringing-the-querying-power-of-sql-to-javascript.aspx

function curry(f) {
	var slice = Array.prototype.slice;
	var args = slice.call(arguments, 1);
	return function () {
		return f.apply(this, args.concat(slice.call(arguments, 0)));
	};
}

function fold(foldFunc, initial_acc, vector) {
	var acc = initial_acc;
	for (var i = 0; i < vector.length; ++i) {
		acc = foldFunc(acc, vector[i]);
	}
	return acc;
}

function map(f, v) {
	return fold(function (acc, x) {
		return acc.concat(f(x));
	}, [], v);
}

function filter(p, v) {
	return fold(function (acc, x) {
		if (p(x)) {
			return acc.concat(x);
		} else {
			return acc;
		}
	}, [], v);
}

Array.prototype.where = function (p) {
	return filter(p, this);
};

Array.prototype.select = function (f) {
	return map(f, this);
};



//http://stackoverflow.com/questions/1669190/javascript-min-max-array-values
Array.prototype.max = function () {
	return Math.max.apply(null, this);
};

Array.prototype.min = function () {
	return Math.min.apply(null,this);
};

Array.prototype.sum = function(){ 
    return this.reduce(function(a,b) {return a+b ;})
};

Array.prototype.sum = function (prop) {
    var total = 0
    for ( var i = 0, _len = this.length; i < _len; i++ ) {
        total += this[i][prop]
    }
    return total
}

Array.prototype.mean = function(){ 
    return  this.sum()/this.length; 
};

function compareNumbers(a, b) {
  return a - b;
}

Array.prototype.median= function(){ 
    return  this.sort(compareNumbers)[parseInt(this.length/2)];
}
