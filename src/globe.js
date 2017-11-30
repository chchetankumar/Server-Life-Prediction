import React from 'react';
import ReactDOM from 'react-dom';
//import Pie from './pie_charts';

class Globe extends React.Component{


    constructor(props){
        super(props);
        this.state={ globe_data:null };
        this.globe=null;
        this.bubble_map = null;
        this.HighChartsOptions= {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
            },
            plotOptions: {
            pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
            }
            },
            series:{},

        };
    }
    redraw= function() {
              this.bubble_map.svg.select('g').selectAll('path').style('vector-effect', 'non-scaling-stroke');
              this.rescaleWorld();
              this.rescaleBubbles();
              this.setEvents();
        }.bind(this);

    rescaleWorld= function () {
        if ( d3.event.scale > 0.8 ) {
          this.bubble_map.svg.selectAll('g').attr('transform', 'translate(' + d3.event.translate + ') scale(' + d3.event.scale + ')');
        }
     }.bind(this);
    rescaleBubbles= function () {
          var bubbleRadius = 4;
          var bubbleBorder = 15;
          if ( d3.event.scale > 0.8 ) {
          this.bubble_map.svg.selectAll('.datamaps-bubble').attr('r', bubbleRadius / d3.event.scale); 
        }
    }.bind(this);
          /*this.bubble_map.svg.selectAll('.datamaps-bubble').on("mouseenter",function(event) {
                if ( $(".h_charts").length == 1 ) {
                    var critical = $(".h_charts").data('critical');
                    var high = $(".h_charts").data('high');
                    var medium = $(".h_charts").data('medium');
                    var low = $(".h_charts").data('low');
                    Highcharts.chart("h_charts",{
                                chart: {plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false, type: "pie", title:"DataCenter Health" },
                                pie:{cursor: 'pointer', allowPointSelect: true, dataLabels: { enabled: true, format: '<b>{point.name}</b>:'  }},
                                plotOptions: { pie: { allowPointSelect: true, cursor: "pointer", dataLabels: { enabled: false }, showInLegend: true } },
                                series:[{ name:"Probability", data:[ { name: "Critical", y: critical, color:"red" } , { name: "High", y: high,color:"orange" }, { name: "Medium", y: medium, color:"blue" },{ name: "low", y: low,color:"green" }]
                    }]});

                } else {
                    console.log('Not Found');
                }
        });*/

    componentDidMount(){
         this.bubble_map = new Datamap({element: document.getElementById('globe_div'),
                        fills: {
                            defaultFill: '#ABDDA4',
                            'b1': '#2b8a1e',
                            'b2': 'blue',
                            'b3': 'orange',
                            'b4': 'red'
                        } ,
                        geographyConfig: {
                            popupOnHover: true,
                        },
                        bubblesConfig: {
                            borderWidth: 0,
                            popupOnHover: false,
                        },
         });
         /*this.zoom=new Zoom({
            $container: $('#globe_div'),
            datamap: this.bubble_map,
         });*/
         this.setEvents();
         this.bubble_map.svg.call(d3.behavior.zoom().on('zoom', this.redraw));
    }
    componentWillMount() {
            // Do the Ajax Query Here

        $.ajax({ 'url': 'https://chetan-techjam.deploy.akamai.com/cgi/handle_globe_data.cgi',
                'success': function (data) {
                var globe_data=[];
                var dc_details = data['dc_details'];
                var stats_data = data['data_values'];
                
                for( var i in dc_details ) {
                    var [lat,lon]=i.split(':');
                    var name = dc_details[i]['dc_name']+'('+dc_details[i]['dc_id']+')'; 
                    var city=dc_details[i]['city'];
                    var state=dc_details[i]['state'];
                    var country=dc_details[i]['country'];
                    var dc_id=dc_details[i]['dc_id'];
                    var b1=(stats_data[dc_details[i]['dc_id']]['B1'])?parseInt(stats_data[dc_details[i]['dc_id']]['B1']):0;
                    var b2=(stats_data[dc_details[i]['dc_id']]['B2'])?parseInt(stats_data[dc_details[i]['dc_id']]['B2']):0;
                    var b3=(stats_data[dc_details[i]['dc_id']]['B3'])?parseInt(stats_data[dc_details[i]['dc_id']]['B3']):0;
                    var b4=(stats_data[dc_details[i]['dc_id']]['B4'])?parseInt(stats_data[dc_details[i]['dc_id']]['B4']):0;
                    var fillkey='';
                    var total = (b1+b2+b3+b4);
                    if ( (b4+b3) > 0.8*total ){
                        fillkey='b4';
                    } else if ( (b4+b3) > 0.6*total ){
                        fillkey='b3';
                    }else if ( (b4+b3) > 0.4*total ){
                        fillkey='b2';
                    }else{
                        fillkey='b1';
                    }
                    globe_data.push({ 'name': name, 'dc_id':dc_id,'radius':4, 'city': city, 'country':country, 'latitude':lat, 'longitude':lon, 'b1':b1, 'b2':b2, 'b3':b3, 'b4':b4, 'fillKey':fillkey  });
                }
                this.setState({'globe_data':globe_data });
            }.bind(this)
        });        

    }
    setEvents= function() {
            d3.selectAll('.datamaps-bubble').on("mouseenter",function(bubble) {
                if ( $("#h_charts").length == 1 ) {
                    $("#h_charts").remove();
                }
                var hoverover = $('<div />').addClass('h_charts').attr('id','h_charts').attr('data-critical',bubble.b4).attr('data-high',bubble.b3).attr('data-medium',bubble.b2).attr('data-low',bubble.b1).css("position","absolute").css("left",d3.event.pageX).css("top",d3.event.pageY).appendTo($('body'));
                    var critical = $(".h_charts").data('critical');
                    var high = $(".h_charts").data('high');
                    var medium = $(".h_charts").data('medium');
                    var low = $(".h_charts").data('low');
                    var series_data = [];
                    if (critical > 0){ series_data.push({ name: "Critical", y: critical, color:"red" }) };
                    if (high > 0){ series_data.push({ name: "High", y: high,color:"orange" }) };
                    if (medium > 0){ series_data.push({ name: "Medium", y: medium, color:"blue" }) };
                    if (low > 0){ series_data.push({ name: "Low", y: low,color:"green" }) }; 
                    Highcharts.chart("h_charts",{
                                chart: {plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false, type: "pie"},
                                title:{text:"Datacenter server health <br/>" + bubble.name},
                                credits: {enabled: false},
                                legend: {labelFormatter: function () { return this.name + ' ['+this.y+' '+(this.y>1?'servers':'server')+']';}},
                                pie:{cursor: 'pointer', allowPointSelect: true, dataLabels: { enabled: true, format: '<b>{point.name}</b>:'  }},
                                plotOptions: { pie: { allowPointSelect: true, cursor: "pointer", dataLabels: { enabled: false }, showInLegend: true } },
                                 series:[{ name:"Probability", data:series_data }],
                                //series:[{ name:"Probability", data:[ { name: "Critical", y: critical, color:"red" } , { name: "High", y: high,color:"orange" }, { name: "Medium", y: medium, color:"blue" },{ name: "low", y: low,color:"green" }]
                    });

        });
        d3.selectAll('.datamaps-bubble').on("mouseleave", function() {
                if ( $("#h_charts").length == 1 ) {
                    $("#h_charts").remove();
                }
        });
        d3.selectAll('.datamaps-bubble').on("click", function(bubble) {
            window.location.href='/#/dc_details/'+bubble.dc_id;
        });
    }.bind(this);
    /*popupTemplate=function(geo,data) {
            console.log(data);
                                title:{ text: 'DataCenter Server Health for '+bubble.name },
            let hoverOn=<Pie critical={data.B4} high={data.B3} medium={data.B2} low={data.B1} ></Pie>;
/*<div class="hoverinfo"> 
                                    {data.name} , {data.city} , {data.country}
                            </div>;
            console.log(hoverOn);
            return hoverOn  

    }.bind(this);*/
    componentDidUpdate () {
    
        if ( this.state.globe_data != null && d3.selectAll('.datamaps-bubble')[0].length==0  ) {
            this.bubble_map.bubbles(this.state.globe_data,{
                responsive: true,
                geographyConfig: { popupOnHover: false},
            });
            this.setEvents(); 
               /*popupTemplate: function(geo,data) {
                   var return_string=  '<div class="hoverinfo">'+data.name+','+data.city+','+data.country+
                            '<div  class="h_charts" id="h_charts" data-critical="'+data.b4+'" data-high="'+data.b3+'" data-medium="'+data.b2+'" data-low="'+data.b1+'">Test</div></div>';
                            /*<script> (function() {console.log("Inside Script");'+
                                'Highcharts.chart("h_charts",{ chart: {plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false, type: "pie" },'+
                                            'plotOptions: { pie: { allowPointSelect: true, cursor: "pointer", dataLabels: { enabled: false }, showInLegend: true } },'+
                                            'series:[ { name: "Critical", y: '+data.b4+' }, { name: "High", y:'+data.b3+'}, { name: "Medium", y:'+ data.b2+' }, { name: "Low", y:'+ data.b1+'}]});})(); '+
                             '</script>' ;
                       return return_string; 
                }*/

            //console.log(this.bubble_map.svg.selectAll('.datamaps-bubble'));
    /*        d3.selectAll('.datamaps-bubble').on("mouseenter",function(bubble) { 
                if ( $("#h_charts").length == 1 ) {
                    $("#h_charts").remove();
                }
                var hoverover = $('<div />').addClass('h_charts').attr('id','h_charts').attr('data-critical',bubble.b4).attr('data-high',bubble.b3).attr('data-medium',bubble.b2).attr('data-low',bubble.b1).css("position","absolute").css("left",d3.event.pageX).css("top",d3.event.pageY).appendTo($('body'));
                    var critical = $(".h_charts").data('critical');
                    var high = $(".h_charts").data('high');
                    var medium = $(".h_charts").data('medium');
                    var low = $(".h_charts").data('low');
                    Highcharts.chart("h_charts",{
                                chart: {plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false, type: "pie", title:"DataCenter Health" },
                                pie:{cursor: 'pointer', allowPointSelect: true, dataLabels: { enabled: true, format: '<b>{point.name}</b>:'  }},
                                plotOptions: { pie: { allowPointSelect: true, cursor: "pointer", dataLabels: { enabled: false }, showInLegend: true } },
                                series:[{ name:"Probability", data:[ { name: "Critical", y: critical, color:"red" } , { name: "High", y: high,color:"orange" }, { name: "Medium", y: medium, color:"blue" },{ name: "low", y: low,color:"green" }]
                    }]});

        });
        d3.selectAll('.datamaps-bubble').on("mouseleave", function() {
                if ( $("#h_charts").length == 1 ) {
                    $("#h_charts").remove();
                }
        });
          */              
        }
  }

  render(){
        return(<div className="widget-container clearfix">
            <div className="widget-title">
            Server Failure Probability
            </div>
            <div id='globe_div' ref={(input)=>this.globe_div=input} style={{"height":"450px", "textAlign":"center"}} ></div>
            {this.props.children}
            </div>
            );
  }

}


export default Globe;
