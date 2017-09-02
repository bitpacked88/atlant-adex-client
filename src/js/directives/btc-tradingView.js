

// highcharts styling:
// http://www.highcharts.com/docs/chart-design-and-style/design-and-style


angular.module('web').directive(
    'btcTradingView',
    ['authService', 'datafeedService', 'apiService', 'appMessages', 'splashService', '$window', '$timeout', '$interval', 'hubService', '$filter',
        function (authService, datafeed, apiService, appMessages, splashService, $window, $timeout, $interval, hubService, $filter) {
            return {
                restrict: 'A',
                templateUrl: 'views/directives/btc-tradingView.html',
                link: function ($scope, element) {




                        $scope.$on(appMessages.hub.newCandle, function(event, candleToAdd){



                                // update



                                    $scope.stockView.series[0].data[ $scope.stockView.series[0].data.length - 1 ]
                                        .update(
                                            $scope.stockView.series[0].type === "candlestick" ?
                                                [ candleToAdd[0], candleToAdd[1], candleToAdd[2], candleToAdd[3] ] : candleToAdd[3],
                                            true, true
                                        );

                                    // volume
                                    if($scope.stockView.series[1].visible)
                                        $scope.stockView.series[1].data[ $scope.stockView.series[1].data.length - 1 ]
                                            .update(
                                                candleToAdd[4],
                                                true, true
                                            );



                                // add



                                    if(candleToAdd[5] === true){

                                        $scope.lastCandleMilliseconds += $scope.rangeMilliseconds;

                                        // candles
                                        $scope.stockView.series[0].addPoint(
                                            $scope.stockView.series[0].type === "candlestick" ?
                                            {
                                                'x':     $scope.lastCandleMilliseconds,
                                                'y':     candleToAdd[3],
                                                'open':  candleToAdd[0],
                                                'high':  candleToAdd[1],
                                                'low':   candleToAdd[2],
                                                'close': candleToAdd[3]
                                            }:[
                                                $scope.lastCandleMilliseconds,
                                                candleToAdd[3]
                                            ],
                                            true, true
                                        );

                                        // volume
                                        $scope.stockView.series[1].addPoint(
                                            [ $scope.lastCandleMilliseconds, 0 ],
                                            true, true
                                        );
                                    }



                        });



                        $scope.showGraphType = function(whatType){
                            $scope.graphType = whatType;
                            $window.localStorage.graphType = whatType;
                            $scope.updateGraphStat($scope.thePeriod, true);
                        };



                // main functions



                        // init graph, called on start only
                        $scope.initGraph = function (){



                            function doDrawGraph(){
                                $scope.updateGraphStat($scope.thePeriod);
                            }



                            function updateStockViewSize() { // force graph resize and handle size changes:
                                    $scope.stockView.setSize( element[0].offsetWidth, element[0].offsetHeight - 45, false );
                                $timeout(function(){
                                    //$scope.stockView.reflow();
                                }, 100);
                            }



                            angular.element($window).on("resize.btcGraphResize", updateStockViewSize);

                            $scope.$on(  appMessages.auth.change,      function(){
                                $timeout(function(){updateStockViewSize()}, 1);
                            } );

                            $scope.$on (appMessages.graph.switchType, function(){
                                updateStockViewSize();
                            } );

                            $scope.$on (appMessages.currency.pairChanged, function(){
                                doDrawGraph();
                                updateStockViewSize();
                            });


                            $timeout(function(){
                                $scope.$on(  appMessages.settings.themeSwitch, function(){
                                    $scope.redrawChart();
                                    updateStockViewSize();
                                });
                            }, 400);

                            doDrawGraph();

                        };



                        $scope.getThemeSettings = function( themeToGet, rateData, volumeData ){
                            function getSeriesOptions(seriesType, seriesData){
                                if(seriesType === "candlestick"){
                                    return {
                                        id: 'rate',
                                        type: 'candlestick',
                                        name: 'Candle',
                                        data: seriesData,
                                        color:        "#d95254",
                                        lineColor:    "#d95254",
                                        upColor:      "#74AF63",
                                        upLineColor:  "#74AF63",
                                        yAxis:0
                                    }
                                }else if(seriesType === "line"){
                                    return {
                                        id: 'rate',
                                        type: 'line',
                                        name: 'Close value',
                                        data: seriesData,
                                        color:       "#0f88a5",
                                        lineColor:   "#0f88a5",
                                        upColor:     "#0f88a5",
                                        upLineColor: "#0f88a5",
                                        yAxis:0
                                    }
                                }else if(seriesType === "volume"){
                                    return {
                                        type: 'column',
                                        name: 'Volume',
                                        data: seriesData,
                                        lineWidth: 0,
                                        color : "rgba(70,70,70,0.8)",
                                        lineColor : "rgba(70,70,70,0.8)",
                                        fillColor : "rgba(70,70,70,0.8)",
                                        yAxis:1
                                    }
                                }
                            }
                            var isWhite = themeToGet == "white";
                            var settingsToReturn = {

                                colors: ['#d95254', '#224457', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#cccccc', '#FFF263', '#6AF9C4'],

                                chart: {
                                    spacing: [0,0,0,0],
                                    margin: [0,0,0,0],

                                    renderTo: 'high-stocks-target',
                                    borderWidth: 0,
                                    backgroundColor: isWhite ? '#fff' : '#0e1a24',

                                    plotBorderWidth: 0,
                                    plotBorderColor: "blue",

                                    animation:false,
                                    events: {
                                        redraw: function () {},
                                        load : function () {
                                            $timeout(function(){
                                                var theExtremes = $scope.stockView.series[0].xAxis.getExtremes();
                                                $scope.stockView.series[0].xAxis.setExtremes( theExtremes.max - 60000, theExtremes.max );
                                                $scope.stockView.series[0].xAxis.setExtremes( theExtremes.min, theExtremes.max );
                                            }, 1);
                                        }
                                    }
                                },

                                credits: { enabled: false },

                                scrollbar: { enabled: false },

                                // common series options
                                plotOptions: {
                                    series: {
                                        animation: false, // terra incognita bug if is on - masked volume data on start
                                        dataGrouping:{ enabled: true },
                                        turboThreshold: 4000
                                    }
                                },

                                rangeSelector: {
                                    enabled: false,
                                    selected: 0
                                },

                                title: {},

                                tooltip: { valueDecimals: 2 },

                                xAxis: {
                                    //opposite:  true,
                                    lineWidth: 0,
                                    lineColor: "rgba(255,255,255,0.1)"
                                },

                                yAxis: [
                                    {
                                        opposite:false,
                                        labels:{
                                            align:"left",
                                            x:2,
                                            y:-4
                                        },
                                        height: '70%',
                                        lineWidth: 0,
                                        lineColor: isWhite ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.16)",
                                        gridLineColor: isWhite ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.16)",
                                        gridLineWidth:1
                                    }, {
                                        opposite:false,
                                        labels:{
                                            align:"left",
                                            x:2,
                                            y:-4
                                        },
                                        top: '72%',
                                        height: '25%',
                                        offset: 0,
                                        lineWidth: 0,
                                        lineColor: isWhite ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.16)",
                                        gridLineColor: isWhite ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.16)",
                                        gridLineWidth:1
                                    }
                                ],

                                series: [
                                    getSeriesOptions($scope.graphType, rateData),
                                    getSeriesOptions("volume", volumeData)
                                ],
                                navigator: {
                                    baseSeries: 0,
                                    series: {
                                        id: 'rate',
                                        lineWidth: 2,
                                        color: "#232323",
                                        lineColor: "#444"
                                    }
                                }
                            };
                            return settingsToReturn;
                        };



                        // this is called on init and after interface interactions
                        $scope.updateGraphStat = function (periodKey, fastSwitch) {

                            $scope.thePeriod = periodKey !== undefined ? periodKey : $scope.thePeriod;

                            if (!fastSwitch) splashService.start("graph");

                            datafeed.getBars($scope.thePeriod)
                                .then(function (res) {

                                    var data = res.data.result.candles;

                                    $scope.rateSeries             = [];
                                    $scope.volumeSeries           = [];
                                    $scope.rangeMilliseconds      = $filter('ticksToMillisecondsNoEpoch')(res.data.result.candleTicks);
                                    $scope.lastCandleMilliseconds = $filter('ticksToLocalMilliseconds')(res.data.result.startTicks);


                                    // preparing series
                                    for (var i = 0; i < data.length; i += 1) {
                                        $scope.lastCandleMilliseconds += $scope.rangeMilliseconds;
                                        $scope.rateSeries.push(
                                            $scope.graphType === "candlestick" ?
                                            {
                                                'x':     $scope.lastCandleMilliseconds, // the date
                                                'y':     data[i][3],                    // close
                                                'open':  data[i][0],                    // open
                                                'high':  data[i][1],                    // high
                                                'low':   data[i][2],                    // low
                                                'close': data[i][3]                     // close
                                            }:[
                                                $scope.lastCandleMilliseconds, // the date
                                                data[i][3]                     // close for line
                                            ]
                                        );
                                        $scope.volumeSeries.push([
                                            $scope.lastCandleMilliseconds,  // the date
                                            data[i][4]                      // the volume
                                        ]);
                                    }


                                    $scope.redrawChart();


                                    // zoom navigator to fit all period
                                    $scope.stockView.xAxis[0].setExtremes(
                                        $scope.lastCandleMilliseconds - $scope.allTheRanges[$scope.thePeriod].seconds * 1000,
                                        $scope.lastCandleMilliseconds
                                    );

                                    hubService.setCandleSize(res.data.result.candleSize);
                                    $scope.$broadcast(  appMessages.graph.switchType );


                                })
                                .catch(function(res){
                                    alert("this is strange :: rferf :: " + res.data.code);
                                })
                                .finally(function(){

                                    if (!fastSwitch) splashService.finish(true);

                                });
                        };



                        $scope.redrawChart = function (){
                            // creating graph or reseting it
                            if ($scope.stockView !== undefined) $scope.stockView.destroy();
                            $scope.stockView = new Highcharts.StockChart(
                                $scope.getThemeSettings (
                                    $window.localStorage['white_theme'] == "true" ? 'white' : 'black',
                                    $scope.rateSeries,
                                    $scope.volumeSeries
                                )
                            );
                            $timeout(function(){

                            },500);

                        };




                // declare variables - - - - - - - - - - -




                        $scope.allTheRanges = datafeed.options();
                        $scope.rangeMilliseconds = 0;
                        $scope.lastCandleMilliseconds = 0;
                        $scope.thePeriod  = 1;
                        $scope.stockView  = undefined;
                        $scope.rateData   = [];
                        $scope.volumeData = [];
                        $scope.graphType  = $window.localStorage.graphType || "candlestick";





                // start - - - - - - - - - - - - - - - - -




                         $scope.initGraph();




                }
            }
        }]);
