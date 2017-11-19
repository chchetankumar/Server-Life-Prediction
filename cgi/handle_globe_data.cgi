#!/usr/bin/perl
use CGI;
use JSON;
use lib '/u0/chchitti/git_code/perllib';
use NIE::Database;

my $q = new CGI();
my $dbh = openTransRO('hardware_perf');
print $q->header('application/json');
my $sql ="select a.DATA_CENTER_ID,
GEOCODE_LATITUDE,
GEOCODE_LONGITUDE,
DATA_CENTER_NAME,
score_bucket, 
count(*) 
from
(SELECT DATA_CENTER_ID,
DATA_CENTER_NAME,
SERIAL_NUMBER, 
CASE
    when b.score BETWEEN 0 and 40 THEN 'B1'
    when b.score BETWEEN 40 and 60 THEN 'B2'
    when b.score BETWEEN 60 and 80 THEN 'B3'
    when b.score BETWEEN 80 and 100 THEN 'B4'
    when b.score >100 THEN 'B5'
END score_bucket
from server_score_live a, server_probability b
where lower(STATUS)='live' and a.SERIAL_NUMBER=b.serial
) a , CMN_INT.AK_DATA_CENTER dc
where a.DATA_CENTER_ID=dc.DATA_CENTER_ID
group by DATA_CENTER_ID,score_bucket";

my $results = $dbh->selectall_arrayref($sql);
my $results_formatted={};
for my $row (@{$results}) {
    my $location=$row->[1].":".$row->[2];
     $results_formatted->{$location}->{'dc_name'}=$row->[3];
     $results_formatted->{$location}->{'dc_id'}=$row->[0];
     $results_formatted->{$location}->{$row->[4]}=$row->[5];
}
print encode_json($results_formatted);

