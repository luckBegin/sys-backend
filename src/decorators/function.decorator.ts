const recursiveCall = function(arr: any[], args) {
	if ( arr.length === 0 ) {
		// arr[0].apply(this , args)
		//     .subscribe(
		//         res => {
		//             console.log(res) ;
		//         }
		//     )
	} else {
		try {
			arr[0].apply(this, args)
				.subscribe(
					res => {
						arr.shift();
						args.push(res);
						recursiveCall.call(this, arr, args);
					}
				);
		} catch (e) {
			arr.shift();
			recursiveCall.call(this, arr, args);
		}
	}
};

export function Before(fncName: string | any): MethodDecorator {
	return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const fnc = target[propertyKey];

		!fnc.__beforeCache && (fnc.__beforeCache = []);

		const _args = arguments;

		if ( !fncName ) {
			return;
		}

		if ( fncName instanceof Function ) {
			fnc.__beforeCache.unshift(fncName) ;
		}
	};
}

export function After(fncName: string | any): MethodDecorator {
	return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const fnc = target[propertyKey];

		!fnc.__afterCache && (fnc.__afterCache = []);
		
		if ( !fnc ) {
			return;
		}

		if ( !fncName ) {
			return;
		}

		if ( fncName instanceof Function ) {
			fnc.__afterCache.unshift(fncName);
		}
	};
}

export function CombineAll(): MethodDecorator {
	return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

		const fnc = target[propertyKey];

		const raw = descriptor.value;

		descriptor.value = function(...args) {
			let beforeFn, afterFn, _arr = [];

			if ( fnc['__beforeCache'] ) {
				beforeFn = fnc['__beforeCache'];
				_arr = _arr.concat(beforeFn);
			}
			_arr.push(raw);
			if ( fnc['__afterCache'] ) {
				afterFn = fnc['__afterCache'];
				_arr = _arr.concat(afterFn);
			}
			recursiveCall.call(this, _arr, args);
		};
	};
}
