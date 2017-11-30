#!/usr/bin/perl
use CGI;
use JSON;
use lib '/u0/chchitti/git_code/perllib';
use NIE::Database;

my $q = new CGI();

my $dbh = openTransRO('hardware_perf');
print $q->header('application/json');

my $dc_id = $q->param('dc_id')||'B-C-9097N7';
my $sql = "select SERIAL_NUMBER,
PRODUCT_NAME,
SERVER_TYPE,
REGION_NUMBER,
REGION_NAME,
a.DATA_CENTER_ID,
a.DATA_CENTER_NAME,
REGION_NETWORK,
WARRANTY_END_DATE,
FT_ISSUES,
AGE,
365*DOWN_YEARS Down_Days,
b.SCORE,
c.GEOCODE_CITY,d.name
from server_score_live a, 
server_probability b  , CMN_INT.AK_DATA_CENTER c left outer join netarch.countrycodes d on (lower(d.country)=lower(c.GEOCODE_COUNTRY) )
where a.SERIAL_NUMBER=b.serial and a.DATA_CENTER_ID=c.DATA_CENTER_ID and 
lower(a.STATUS)='live' and 
a.DATA_CENTER_ID=?";
my $results= $dbh->selectall_arrayref($sql,{},$dc_id);

my $dc_name_sql = "SELECT NAME from CMN_INT.AK_DATA_CENTER where DATA_CENTER_ID=?";
my $dc_name = $dbh->selectall_arrayref($dc_name_sql,{},$dc_id);

print encode_json({servers=>$results, dc_name=> $dc_name->[0]->[0] });

