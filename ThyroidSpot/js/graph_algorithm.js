//THIS WILL BE WHERE THE GRAPH FUNCTION COMES

var treatmentList = [];//set FT4 + TSH array from patient-info 
var validArray = []; //array for valid treatments
var outlierArray = [] //array for outlier treatments

var totalNumOfTreatments; //get length of treatmentList array
var errorList = [];
var prevErrorList = [];

var extraTreatment = [];

var bestfitvalidft4List = [];
var bestfitvalidtshList = [];

var bestfitvalidData = [];

var errorThreshold;
var currentMinAvgError;
var prevTreatment;

var maxErrorTreatment;

var phi;
var snum;

//setting units for FT4 and TSH
var ft4Unit;
var tshUnit;

var myChart

//initialising calculation functions
function startCalc(){
    console.log("initialising calculations...")
    extraTreatment = TreatmentArray
    treatmentList = TreatmentArray //set FT4 + TSH array from patient-info 

    ft4Unit = " pmol/L";
    tshUnit = " mU/L";
    
    validArray = treatmentList

    
    totalNumOfTreatments = treatmentList.length;
    removeOutliers(); //call function to remove outliers
    for (var i = 0; i < treatmentList.length; i++) {
        found = false;
        for (var j = 0; j < validArray.length; j++) {
            if (treatmentList[i].TSH == validArray[j].TSH
                    && treatmentList[i].FT4 == validArray[j].FT4
                    && treatmentList[i].timestamp == validArray[i].timestamp) {
                found = true;
                
                break;
            }
        }
        if (found == false) {
            outlierTreatments.push(treatmentList[i]); //ADD OUTLIER DATA TO OUTLIER ARRAY
        }
    }


    //INITIALISING BEST FIT FT4 + TSH ARRAYS

    var validminX = validArray[0].FT4; // min of X
    var validminXy = validArray[0].TSH; // y corresponding to
  
    var validmaxX = validArray[0].FT4; // max of X
    var validmaxXy = validArray[0].TSH; // y corresponding to

    //GETTING VALID MIN AND VALID MAX FT4, TSH READINGS
    for (var i = 1; i < validArray.length; i++) {
        if (validArray[i].FT4 > validmaxX) {
            validmaxX = validArray[i].FT4;
            validmaxXy = validArray[i].TSH;
        }
        if (validArray[i].FT4 < validminX) {
            validminX = validArray[i].FT4;
            validminXy = validArray[i].TSH;
        }
    }

    //GETTING VALID RANGE AND FIT INTO BEST FIT ARRAYS
    var validxRange = validmaxX - validminX;
    var validxRangeExt = validxRange / 10;
    var minToAdd = validminX - (validxRangeExt);
    bestfitvalidft4List.push(minToAdd);
    for (var i = 0; i < 50; i++) {
        var toAdd = validminX + (i * (validxRange / 50));
        bestfitvalidft4List.push(toAdd);
    }
    var maxToAdd = validmaxX + validxRangeExt;
    bestfitvalidft4List.push(maxToAdd);

    //NOTE: for phi and snum, refer BestFitCurve
    for (var i = 0; i < bestfitvalidft4List.length; i++) {
        var TSH = snum / Math.pow(Math.E, (phi * bestfitvalidft4List[i]));
        bestfitvalidtshList.push(TSH);
    }

    //storing best fit valid data into array to display the chart with these values
    bestfitvalidData = [];
    if (bestfitvalidft4List.length != 0) {
        for (var i = 0; i < bestfitvalidft4List.length; i++) {
            bestfitvalidData.push({x: bestfitvalidft4List[i], y: bestfitvalidtshList[i]});
        }
    }
    else{
        console.log("no best fit data")
    }


    launchgraph(); //send data to the graph for rendering display
}


//calculating best fit curve function
function bestfitCurve(vaz){
    console.log("calculating best fit curve...")

        validArray = vaz

        treatmentROList = [];
		
		//getting TSH (valid data)
		for(var i = 0; i < validArray.length; i++)
		{
			var t = validArray[i];
			t.TSH = Math.log(t.TSH);
			treatmentROList.push(t);
		}
		

		// formula of line
		var m1 = 0;
		var m2 = 0;
		var m3 = 0;
		var m4 = 0;

		//Setting line formulae
		for (var i = 0; i < treatmentROList.length; i++) {
			var dst = treatmentROList[i].FT4;
			m1 += dst * dst;
			m2 += treatmentROList[i].FT4 *treatmentROList[i].TSH;
			m3 += treatmentROList[i].FT4;
			m4 += treatmentROList[i].TSH;
		}

		//Setting x mean and y mean, with formula A and formula B
		var XMean = m3 / treatmentROList.length;
		var YMean = m4 / treatmentROList.length;
		var formulaA = (m2 - m3 * YMean) / (m1 - m3 * XMean);
		var formulaB = YMean - formulaA * XMean;
		// equation: Y = Slope * X + YInt

		//setting phi and snum
		var roPhi = -formulaA;
		var roSnum = Math.pow(Math.E, formulaB);
		phi = roPhi;
		snum = roSnum;

        //determining error list and avg error
		errorList = [];
		var totalError = 0;
		var averageError = 0;
		for (var i = 0; i < validArray.length; i++) {

            var iError1 = Math.abs(validArray[i].TSH - (roSnum * Math.pow(Math.E,(-roPhi * validArray[i].FT4)))); 
            var iError2 = Math.abs(validArray[i]).FT4 - (Math.log(roSnum / validArray[i].TSH) / roPhi);
            var iError = Math.min(iError1, iError2);
			errorList.push(iError);
			totalError += iError;
        }
		averageError = totalError / errorList.length;
		return averageError;
}




//function to remove outliers
function removeOutliers(){
    console.log("removing outliers...")

    //set min max FT4 and TSH outliers variables
    var minFT4 = treatmentList[0].FT4;
    var maxFT4 = treatmentList[0].FT4;
    var minTSH = treatmentList[0].TSH;
    var maxTSH = treatmentList[0].TSH;

    //Get max and min via for loop if else conditions
    for (var i = 1; i < treatmentList.length; i++) {
        if (treatmentList[i].FT4 > maxFT4)
            maxFT4 = treatmentList[i].FT4;
        if (treatmentList[i].FT4 < minFT4)
            minFT4 = treatmentList[i].FT4;
        if (treatmentList[i].TSH > maxTSH)
            maxTSH = treatmentList[i].TSH;
        if (treatmentList[i].TSH < minTSH)
            minTSH = treatmentList[i].TSH;
    }

    //calculating error threshold
    errorThreshold = Math.min(((maxTSH - minTSH) / 20),
            ((maxFT4 - minFT4) / 20));

    //calculating min avg error with error list
    currentMinAvgError = Math.min((maxTSH - minTSH), (maxFT4 - minFT4));
    var iterationCount = 0;
    var avgError = bestfitCurve(validArray);
    //prevErrorList = (ArrayList<Double>) errorList.clone();
    prevErrorList = [];
    for (var i=0;i<errorList.length;i++){
        var d= errorList[i];
        prevErrorList.push(d);
    }
        
    while (avgError > errorThreshold
            && iterationCount < 2*totalNumOfTreatments) {
        if (avgError < currentMinAvgError) {
            // can improve curve
            currentMinAvgError = avgError;
            //prevErrorList = (ArrayList<Double>) errorList.clone();
            prevErrorList= [];
            for (var i=0;i<errorList.length;i++){
                var d= errorList[i];
                prevErrorList.push(d);
            }

            // find the largest
            var maxError = errorList[0];
            var maxErrorIndex = 0;
            for (var i = 1; i < errorList.length; i++) {
                if (errorList[i] > maxError) {
                    maxError = errorList[i];
                    maxErrorIndex = i;
                }
            }
            prevTreatment = validArray[maxErrorIndex];
            validArray.pop(maxErrorIndex);
            errorList.pop(maxErrorIndex);

        } else {
            
            validArray.push(prevTreatment);// put the recent removed treatment back to the validArray

            // find the next-largest
            var maxError = prevErrorList[0];
            var maxErrorIndex = 0;
            for (var i = 1; i < prevErrorList.length; i++) {
                if (prevErrorList[i] > maxError) {
                    maxError = prevErrorList[i];
                    maxErrorIndex = i;
                }
            }
            prevTreatment = validArray[maxErrorIndex];
            validArray.pop(maxErrorIndex);
            prevErrorList.pop(maxErrorIndex);

        }
        avgError = bestfitCurve(validArray);
    }
}




//displaying calculated chart (chart hasn't been fully implemented)
function launchgraph(){
    var ctx = document.getElementById('graphcontainer2').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        
        data: {
            datasets: [{
                label: 'Best Fit Curve',
                data: bestfitvalidData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
               
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            }
        }
    });

    //onclick function to show enlarged version of the chart / as well as exporting FT4 and TSH to csv file
    $(document).on("click", "#openGraphModalBtn", function(){
        
        $('#graphModal').modal('toggle');
        var ctx = document.getElementById('graphcontainer1').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'line',
            
            data: {
        
                datasets: [{
                    label: 'Best Fit Curve',
                    data: bestfitvalidData,
                  
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                   
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom'
                    }]
                }
            }
        });
    })
}



//fucntion to export FT4 and TSH calculation
$(document).on("click", "#exportcalc", function(){


    let csv = ""
    
    // Loop the array of objects
    for(let row = 0; row < ExportationArray.length; row++){
        let keysAmount = Object.keys(ExportationArray[row]).length+1
        let keysCounter = 0

        // If this is the first row, generate the headings
        if(row === 0){

            // Loop each property of the object
            for(let key in ExportationArray[row]){

                csv += key + (keysCounter < keysAmount ? ',' : '\r\n' )
               
            }
            csv += "\r\n"
            for(let key in ExportationArray[0]){
                csv += ExportationArray[0][key] + (keysCounter < keysAmount ? ',' : '\r\n' )
                
                keysCounter++
            }
            csv += "\r\n"
        }
        else{
            for(let key in ExportationArray[row]){
                csv += ExportationArray[row][key] + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
                keysCounter++
            }
            csv += "\r\n"
        }

        keysCounter = 0
    }

    // Once we are done looping, download the .csv by creating a link
    let link = document.createElement('a')
    link.id = 'download-csv'
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
    link.setAttribute('download', 'FT4_TSH_calculation.csv');
    document.body.appendChild(link)
    document.querySelector('#download-csv').click()
})

