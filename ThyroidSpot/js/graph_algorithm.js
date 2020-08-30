//THIS WILL BE WHERE THE GRAPH FUNCTION COMES


//TODO: bring in FT4 and TSH arrays from patient-function and patient-info-function
console.log(FT4Array) //successfully retrieved from patientinfo.html
console.log(TSHArray) //successfully retrieved from patientinfo.html
console.log(TreatmentArray) //successfully retrieved from patientinfo.html

var treatmentList = [];//set FT4 + TSH array from patient-info 
var validArray = []; //array for valid treatments
var outlierArray = [] //array for outlier treatments

var totalNumOfTreatments; //get length of treatmentList array
var errorList = [];
var prevErrorList = [];

var bestfitvalidft4List = [];
var bestfitvalidtshList = [];

var errorThreshold;
var currentMinAvgError;
var prevTreatment;

var maxErrorTreatment;

var phi;
var snum;

//setting units for FT4 and TSH
var ft4Unit;
var tshUnit;
//initialising calculation functions
function startCalc(){
    console.log("initialising calculations...")

    treatmentList = TreatmentArray //set FT4 + TSH array from patient-info 

    ft4Unit = " pmol/L";
    tshUnit = " mU/L";
    console.log(TreatmentArray.length)
    
    validArray = treatmentList

    bestfitCurve();

    console.log(validArray)
    totalNumOfTreatments = treatmentList.length;
    console.log(totalNumOfTreatments)
    //removeOutliers(); //call function to remove outliers
    for (var i = 0; i < treatmentList.length; i++) {
        found = false;
        for (var j = 0; j < validArray.length; j++) {
            if (treatmentList[i].TSH == validArray[j].TSH
                    && treatmentList[i].FT4 == validArray[j].FT4
                    && treatmentList[i].timestamp == validArray[i].timestamp) {
                found = true;
                console.log("owo")
                break;
            }
        }
        if (found == false) {
            console.log("no signs of intelligent life anywhere")
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

    //ACHTUNG: for phi and snum, refer BestFitCurve
    for (var i = 0; i < bestfitvalidft4List.length; i++) {
        var TSH = snum / Math.pow(Math.E, (phi * bestfitvalidft4List[i]));
        bestfitvalidtshList.push(TSH);
    }

}


//TODO: set up algorithm (phi and snum) & integrating it with the main function
function bestfitCurve(){
    console.log("calculating best fit curve...")

        treatmentROList = [];
		
		//getting TSH
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
		var totalError = 0.0;
		var averageError = 0.0;
		for (var i = 0; i < validArray.length; i++) {

			var iError1 = Math.abs(validArray[i].TSH
					- (roSnum * Math.pow(Math.E,
							(-roPhi * validArray[i].FT4))));
                            var iError2 = Math.abs(validArray[i]).FT4
					- (Math.log(roSnum / validArray[i].TSH) / roPhi);
                    var iError = Math.min(iError1, iError2);
			errorList.push(iError);
			totalError += iError;
		}
		averageError = totalError / errorList.length;

		return averageError;
}




//TODO: getting outlier data
function removeOutliers(){
    console.log("removing outliers...")

}









//TODO: displaying calculated chart
var ctx = document.getElementById('graphcontainer').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    
    data: {
        labels: ['Ft4', 'TSH', 'ABC'],
        datasets: [{
            label: 'value xx',
            data: [12, 19, 3],
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
            yAxes: [{
                ticks: {
                    beginAtZero: true
                    
                }
            }]
        }
    }
});

//onclick function
$(document).on("click", "#openGraphModalBtn", function(){
    document.getElementById('GraphModal').style.display='block'
    var ctx = document.getElementById('graphcontainer1').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        
        data: {
            labels: ['Ft4', 'TSH', 'ABC'],
            datasets: [{
                label: 'value xx',
                data: [12, 19, 3],
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
            // responsive: true,
            // maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                        
                    }
                }]
            }
        }
    });
})



//TODO: export calculations to CSV
$(document).on("click", "#exportcalc", function(){
    console.log("hi there, what's up man?")
})