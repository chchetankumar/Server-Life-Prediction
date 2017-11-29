import React from 'react';

import ReactDOM from 'react-dom';



class pie extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
                critical: this.props.critical||0,
                high: this.props.high|| 0,
                medium: this.props.medium || 0,
                low: this.props.critical ||0
        };
        this.HighChartsOptions= {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                renderTo:$(this.chart)
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
    componentWillReceiveProps(nextProps) {
        this.setState({ critical: nextProps.critical||0,
                        high: nextProps.high||0,
                        medium: nextProps.medium||0,
                        low: nextProps.low||0,
        });

    }
    componentDidUpdate() {
            this.HighChartsOptions.series.name='Probability of Server Failure';
            this.HighChartsOptions.series.data= [
                    {
                        name: 'Critical',
                        y: this.state.critical
                    },
                    {
                        name: 'High',
                        y: this.state.critical
                    },
                    {
                        name: 'Medium',
                        y: this.state.medium
                    },
                    {
                        name: 'Low',
                        y: this.state.low
                    },
            ];
            Highcharts.chart(this.HighChartsOptions);
        


    }

    render() {
            return (<div ref={(input)=>{this.chart=input;}}>

            </div>)
    }



}

export default pie;
