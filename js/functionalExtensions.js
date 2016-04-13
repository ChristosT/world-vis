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

// Find unique values of an attribute in a list of objects 
// source : http://www.shamasis.net/2009/09/fast-algorithm-to-find-unique-items-in-javascript-array/
Array.prototype.unique = function(attr) {
    var o = {}, i, l = this.length, r = [];
    for(i=0; i<l;i+=1) o[this[i][attr]] = this[i][attr];
    for(i in o) r.push(o[i]);
    return r;
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


Array.prototype.mean = function(){ 
    return  this.sum()/this.length; 
};

function compareNumbers(a, b) {
  return a - b;
}

Array.prototype.median= function(){ 
    return  this.sort(compareNumbers)[parseInt(this.length/2)];
}
