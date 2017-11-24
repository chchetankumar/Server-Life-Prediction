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
GEOCODE_CITY,
GEOCODE_STATE,
GEOCODE_COUNTRY,
GEOCODE_CONTINENT,
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
my $dc_details={}; my $data_set={};
for my $row (@{$results}) {
    my $location=$row->[1].":".$row->[2];
     $dc_details->{$location}->{'dc_name'}=$row->[3];
     $dc_details->{$location}->{'dc_id'}=$row->[0];
     $dc_details->{$location}->{'city'}=$row->[4];
     $dc_details->{$location}->{'state'}=$row->[5];
     $dc_details->{$location}->{'country'}=$row->[6];
     $dc_details->{$location}->{'continent'}=$row->[7];
    $data_set->{$row->[0]}->{$row->[8]}=$row->[9];
}
print encode_json( { dc_details => $dc_details , data_values => $data_set});

