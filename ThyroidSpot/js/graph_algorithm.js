//THIS WILL BE WHERE THE GRAPH FUNCTION COMES


//TODO: bring in FT4 and TSH arrays from patient-function and patient-info-function









//TODO: set up algorithm








//TODO: getting outlier data







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