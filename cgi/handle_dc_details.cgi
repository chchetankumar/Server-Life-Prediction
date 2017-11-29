#!/usr/bin/perl
use CGI;
use JSON;
use lib '/u0/chchitti/git_code/perllib';
use NIE::Database;

my $q = new CGI();
my $dbh = openTransRO('hardware_perf');
print $q->header('application/json');

my $sql = "select SERIAL_NUMBER,
PRODUCT_NAME,
SERVER_TYPE,
STATUS,
REGION_NUMBER,
REGION_NAME,
DATA_CENTER_ID,
DATA_CENTER_NAME,
REGION_NETWORK,
WARRANTY_END_DATE,
FT_ISSUES,
AGE,
DOWN_YEARS,
SERVER_REPLACEMENT,
DISK_REPLACEMENT,
RAM_REPLACEMENT,
PSU_REPLACEMENT,
SCORE,
SSD_SCORE
from server_score_live where DATA_CENTER_ID=?";

my $results= $dbh->selectall_arrayref($sql);


print encode_json({servers=>$results });

