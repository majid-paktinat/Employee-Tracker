const pressAnyKey = require('press-any-key');

function arr_obj_To_arr(sourceArr){
    let middleArr = sourceArr.map(obj => Object.values(obj));
    let desArr = [].concat.apply([], middleArr.map(obj => Object.values(obj)));
    return desArr;
}  

function pressAnyKeyFunc(mycallback){
	pressAnyKey("Press any key to resolve, or CTRL+C to exit", {
		ctrlC: "reject"
		})
		.then(() => {
			mycallback();
		})
		.catch(() => {
            console.log('You pressed CTRL+C')
            process.exit();
	  })
}

module.exports = {
    arr_obj_To_arr,
    pressAnyKeyFunc
}