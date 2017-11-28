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
        }.bind(this);

    rescaleWorld= function () {
          this.bubble_map.svg.selectAll('g').attr('transform', 'translate(' + d3.event.translate + ') scale(' + d3.event.scale + ')');
     }.bind(this);
    rescaleBubbles= function () {
          var bubbleRadius = 4;
          var bubbleBorder = 15;
          this.bubble_map.svg.selectAll('.datamaps-bubble').attr('r', bubbleRadius / d3.event.scale); 
    }.bind(this);
    componentDidMount(){
         this.bubble_map = new Datamap({element: document.getElementById('globe_div'),
                        fills: {
                            defaultFill: '#ABDDA4',
                            'b1': '#2b8a1e',
                            'b2': 'blue',
                            'b3': 'orange',
                            'b4': 'red'
                        } ,
                        bubblesConfig: {
                            borderWidth: 0,
                        },
         });
         this.zoom=new Zoom({
            $container: $('#globe_div'),
            datamap: this.bubble_map,
         });
         this.bubble_map.svg.call(d3.behavior.zoom().on('zoom', this.redraw));
    }
    componentWillMount() {
            // Do the Ajax Query Here

        $.ajax({ 'url': 'https://vidya-techjam.deploy.akamai.com/cgi/handle_globe_data.cgi',
                'success': function (data) {
                var globe_data=[];
                var dc_details = data['dc_details'];
                var stats_data = data['data_values'];
                
                for( var i in dc_details ) {
                    var [lat,lon]=i.split(':');
                    var name = dc_details[i]['dc_name']; 
                    var id = dc_details[i]['dc_id'];
                    var city=dc_details[i]['city'];
                    var state=dc_details[i]['state'];
                    var country=dc_details[i]['country'];
                    var b1=(stats_data[dc_details[i]['dc_id']]['B1'])?parseInt(stats_data[dc_details[i]['dc_id']]['B1']):0;
                    var b2=(stats_data[dc_details[i]['dc_id']]['B2'])?parseInt(stats_data[dc_details[i]['dc_id']]['B2']):0;
                    var b3=(stats_data[dc_details[i]['dc_id']]['B3'])?parseInt(stats_data[dc_details[i]['dc_id']]['B3']):0;
                    var b4=(stats_data[dc_details[i]['dc_id']]['B4'])?parseInt(stats_data[dc_details[i]['dc_id']]['B4']):0;
                    var fillkey='';
                    if ( b4 > b3 && b4 > b2 && b2 > b1 ){
                        fillkey='b4';
                    } else if ( b3 > b4 && b3 > b2 && b3 > b1 ){
                        fillkey='b3';
                    }else if ( b2 > b4 && b2 > b3 && b2 > b1 ){
                        fillkey='b2';
                    }else if ( b1 > b3 && b1 > b2 && b1 > b4 ){
                        fillkey='b1';
                    }
                    globe_data.push({ 'name': name, 'id':id, 'radius':7, 'city': city, 'country':country, 'latitude':lat, 'longitude':lon, 'b1':b1, 'b2':b2, 'b3':b3, 'b4':b4, 'fillKey':fillkey  });
                }
                this.setState({'globe_data':globe_data });
            }.bind(this)
        });        

    }
    /*popupTemplate=function(geo,data) {
            console.log(data);
            let hoverOn=<Pie critical={data.B4} high={data.B3} medium={data.B2} low={data.B1} ></Pie>;
/*<div class="hoverinfo"> 
                                    {data.name} , {data.city} , {data.country}
                            </div>;
            console.log(hoverOn);
            return hoverOn  

    }.bind(this);*/
    componentDidUpdate () {
        if ( this.state.globe_data != null  ) {
            
            this.bubble_map.bubbles(this.state.globe_data,{
                popupTemplate: function(geo,data) {
                   var return_string=  '<div class="hoverinfo">Datacenter:'+data.name+'<br>';
                   if (data.city){ return_string+='City:'+data.city+'<br>';}
                    if (data.country) { return_string+='Country:'+data.country+'<br>';}
                   return_string+='<div  class="h_charts" id="h_charts" data-critical="'+data.b4+'" data-high="'+data.b3+'" data-medium="'+data.b2+'" data-low="'+data.b1+'"></div></div>';
                            /*<script> (function() {console.log("Inside Script");'+
                                'Highcharts.chart("h_charts",{ chart: {plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false, type: "pie" },'+
                                            'plotOptions: { pie: { allowPointSelect: true, cursor: "pointer", dataLabels: { enabled: false }, showInLegend: true } },'+
                                            'series:[ { name: "Critical", y: '+data.b4+' }, { name: "High", y:'+data.b3+'}, { name: "Medium", y:'+ data.b2+' }, { name: "Low", y:'+ data.b1+'}]});})(); '+
                             '</script>' ;*/
                       return return_string; 
                }
            });
            $(".datamaps-bubble").hover(function() { 
                if ( $(".h_charts").length == 1 ) {
                    var critical = $(".h_charts").data('critical');
                    var high = $(".h_charts").data('high');
                    var medium = $(".h_charts").data('medium');
                    var low = $(".h_charts").data('low');
                    console.log($(".h_charts"));
                    var series_data = [];
                    if (critical > 0){ series_data.push({ name: "Critical", y: critical, color:"red" }) };
                    if (high > 0){ series_data.push({ name: "High", y: high,color:"orange" }) };
                    if (medium > 0){ series_data.push({ name: "Medium", y: medium, color:"blue" }) };
                    if (low > 0){ series_data.push({ name: "Low", y: low,color:"green" }) }; 
                    Highcharts.chart("h_charts",{
                        chart: {plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false, type: "pie"}, 
                                title:{text:"Datacenter server health"},
                                credits: {enabled: false},
                                pie:{cursor: 'pointer', allowPointSelect: true, dataLabels: { enabled: true, format: '<b>{point.name}</b>:'  }},
                                plotOptions: { pie: { allowPointSelect: true, cursor: "pointer", dataLabels: { enabled: false }, showInLegend: true } },
                                legend: {labelFormatter: function () { return this.name + ' ['+this.y+' '+(this.y>1?'servers':'server')+']';}},
                                //series:[{ name:"Probability", data:[ { name: "Critical", y: critical, color:"red" } , { name: "High", y: high,color:"orange" }, { name: "Medium", y: medium, color:"blue" },{ name: "low", y: low,color:"green" }]
                                series:[{ name:"Probability", data:series_data
                    }]});

                } else {
                    console.log('Not Found');
                }
        });
                        
        }
  }

  render(){
        return(<div id='globe_div' ref={(input)=>this.globe_div=input} style={{"height":"300px"}} ></div>);
  }

}


export default Globe;
