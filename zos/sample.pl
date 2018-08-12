#!/usr/bin/perl

my $threshold = 0.075;
my $line = <STDIN>;
while( $line ) {
    my $odds = rand();
    if ($odds < $threshold) {
        print $line;
    } else {
        # print "$odds\n";
    }
    $line = <STDIN>;
}
