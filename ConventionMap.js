// This powers the <span class="plainlinks">[http://en.wikifur.com/FurryConventionMap.html map of active conventions]</span>. Edit events in the "Add map points" section below. 

// To get latitude and longitude, find the target on Google Maps, then click the cog and Share (or check the URL) and copy the first two numbers after the '@' (including the decimal bits). 

// Reload the map to check it works after you edit! If there's an apostrophe in a name or location, put a backslash (\) in front of it.<pre>

var map = null;
var infoWindow = null;
var meets = [];

// number of conventions in different areas, displayed in drop down
var count = 0;
var count_na = 0;
var count_eu = 0; 
var count_oceania = 0;
var count_japan = 0;
var count_others = 0;

//constants specifying which region is selected in the drop down
var FILT_ALL = 0;
var FILT_NA = 1;
var FILT_EU = 2;
var FILT_OCEANIA = 3;
var FILT_JAPAN = 4;
var FILT_OTHERS = 5;

//These functions are used to classify conventions into regions
//They are hacks; function only be accurate for existing data
function is_in_na(lat, lng){
    return (lat > 21 && lat < 75 && 
                lng > -144 && lng < -48);
}
function is_in_eu(lat, lng){
    return (lat > 36 && lat < 75 && 
                lng > -13 && lng < 40);
}
function is_in_oceania(lat, lng){
    return (lat > -50 && lat < -5 && 
                lng > 110 && lng < 180);
}
function is_in_japan(lat, lng){
    return (lat > 30 && lat < 40 && 
                lng > 130 && lng < 145);
}

var is_phone = false;

// Used later when creating markers
//var redIcon = L.icon({iconUrl:"http://www.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png"});
//var purpleIcon = L.icon({iconUrl:"http://www.google.com/intl/en_us/mapfiles/ms/micons/purple-dot.png"});
//var blueIcon = L.icon({iconUrl:"http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png"});
//var markerShadow = new google.maps.MarkerImage("//maps.gstatic.com/intl/en_us/mapfiles/markers/marker_sprite.png", new google.maps.Size(37,34), new google.maps.Point(20, 0), new google.maps.Point(10, 34)); 

function load() {
 var useragent = navigator.userAgent;
  is_phone = (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1) //TODO support other phones that support tel: protocol?
  
  if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1) {
  //working around Android Browser having no scroll bar (Fennec/Firefox Mobile has no bar, but can scroll inside divs)
//document.getElementById("map").style.position="fixed"; //Google Maps will undo this
document.getElementById("side").style.height="auto";
document.getElementById("side").style.overflow="auto";

  }
 if (true) {

var mapNode = document.getElementById("map");

markers = [];

// Set initial position
// These values are assuming a 1280x800 monitor with 96dpi.
// it would be nice to scale this according to client area size
var centerlatLng = L.latLng(40,-40);
var mapOpts = {
    zoom: 3,
    center: centerlatLng,
    closePopupOnClick: false
};
// creating map
map = L.map(mapNode, mapOpts);
//map.setView([51.505, -0.09], 13);

var layerOSMStandard = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
var layerMapQuestOpen = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg',{
    attribution: 'Map data &copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors. Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">',
    subdomains: '1234'
});
var layerMapQuestOpenSat = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg',{
    attribution: 'Map data &copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors. Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
    subdomains: '1234'
});
var layerOSMHumanitarian = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
var layerOpenCycleMap = L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
    attribution: 'Map &copy; <a href="http://www.thunderforest.com/">ThunderForest</a>, Map data &copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
var layerThunderforestTransport = L.tileLayer('http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
    attribution: 'Map &copy; <a href="http://www.thunderforest.com/">ThunderForest</a>, Map data &copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
var layerThunderforestOutdoors = L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {
    attribution: 'Map &copy; <a href="http://www.thunderforest.com/">ThunderForest</a>, Map data &copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

L.control.layers({
    "OpenStreetMap Standard": layerOSMStandard,
    "OpenStreetMap Humanitarian": layerOSMHumanitarian,
    "MapQuest Open": layerMapQuestOpen,
    "MapQuest Open Aerial": layerMapQuestOpenSat,
    "Thunderforest OpenCycleMap": layerOpenCycleMap,    //any useful?
    "Thunderforest Public Transport": layerThunderforestTransport,
//    "Thunderforest Outdoors": layerThunderforestOutdoors  (too slow)
}).addTo(map);
L.control.scale().addTo(map);

layerOSMStandard.addTo(map);

infoWindow = L.popup({});

// Add map points
// Format: addLocation(latitude, longitude, 'Name', 'website', 'Place name<br>Street<br>City, State Code<br>Country', 'Phone Number', 'Mon[th] 1-3 20XX', attendance);
addLocation(33.548246, -112.046348, 'Arizona Fur Con', 'Arizonafurcon.com', 'Pointe Hilton Squaw Peak Resort<br>N 16th St<br>Phoenix, Arizona 85020<br>USA', '1(602) 997-2626', 'Oct 31-Nov 2 2014', 533);
addLocation(40.105846, -83.017244, 'AnthrOhio', 'morphicon.org', 'Holiday Inn Columbus-Worthington<br>7007 N. High Street<br>Worthington, Ohio 43085<br>USA', '+1 (614) 436-0700', 'May 5-8, 2016', 342);
//addLocation(-37.891950, -57.832850, 'Animales Sueltos', 'furrycamp.com.ar', 'Camping \'La Serranita\'<br>barrio Colinas Verdes<br>Mar del Plata<br>Argentina', '', 41);
addLocation(42.353979, -71.105356, 'Anthro New England', 'www.anthronewengland.org', 'Hyatt Regency Cambridge, Overlooking Boston<br>575 Memorial Dr<br>Cambridge, MA<br>USA', '1(617) 492-1234', 'Jan 21-Jan 24 2016', 0);
addLocation(40.444334, -79.995532, 'Anthrocon', 'www.anthrocon.org', 'Westin Convention Center Pittsburgh<br>1000 Penn Avenue<br>Pittsburgh, Pennsylvania 15222<br>USA', '+1 (412) 281-3700', 'Jun 30-Jul 3 2016', '5861');
addLocation(-23.970691,-46.329962, 'Brasil FurFest', 'brasilfurfest.com.br', 'Hotel Mercure Santos<br>Av. Washington Luiz, 565<br>Santos (SP)<br>Brazil', '','Sep 9-11, 2016');
addLocation(52.597652, 13.22226, 'BerliCon', 'www.berlicon.org', 'Zeltlagerplatz e.V.<br>Rallenweg 4,13505 Berlin-Heiligensee<br>Germany', '', 'Jun 18-21 2015', 89);
addLocation(39.523177, -119.78106, 'Biggest Little Fur Con', 'www.biggestlittlefurcon.org', 'Grand Sierra Resort<br>2500 East 2nd Street<br>Reno, Nevada 89595<br>USA', '+1 (77) YEAH-BLFC', 'May 12-15 2016', '1442');
//addLocation(61.599498,   9.750860, 'CabinCon', 'swandog.livejournal.com', 'Vinstra<br>Norway', '');//not on list, website is private
//addLocation(39.077092, -74.830348, 'Cape May Fur Meet', 'capemayfurmeet.com', 'Middle Township Elementary School #2<br>101 West Pacific Ave, Cape May Court House<br>Middle, New Jersey 08210<br>USA', '', 'May 19-20 2012', 3);
addLocation(33.679673,-117.852488, 'Califur', 'califur.com', 'Irvine Marriott<br>18000 Von Karman Avenue<br>Irvine, California, 92614<br>USA', '+1 (949) 553-0100', 'Jun 3-5 2016', 1206);
addLocation(43.721056,-121.291552, 'Campfire Tails', 'campfiretails.com', 'Ogden Group Camp C<br>Paulina Lake<br>La Pine, Oregon<br>USA', '', 'Aug 4-Aug 8 2016', 143);
//addLocation(44.858188, -93.221054, 'Cat Days', 'www.mnfurs.org/cat-days', 'Crowne Plaza Hotel and Suites<br>Minneapolis International Airport<br>Appletree Square<br>Bloomington, MN 55425<br>USA', '+1 877-859-5095', 'Aug 3-4 2012');
//addLocation(38.9439, -95.3385, 'Central Midwest Furmeet', 'cmfurmeet.webs.com', ' Bloomington West Group Camp at Clinton Lake near Lawrence, Kansas', '', 'Sep 14-16 2012', 22);
addLocation(37.686355, -97.342702, 'Central Plains Furcon', 'cpfurcon.com', 'Drury Plaza Hotel Broadview<br>400 West Douglas Ave<br>Wichita, KS 67202<br>USA', '', 'Nov 5-8 2015', 100)
addLocation(49.638649,  15.298977, 'ČeSFuR', 'www.cesfur.org', 'Hotel Luna<br>Kouty 77<br>584 01 Kouty<br>Czech Republic', '', 'Jun 24-28 2015', 107);
addLocation(23.061687, 113.296423, 'China National Furry Party', 'www.fb.com/CNFP2015', ', Guangzhou<br>China', '', 'Jul 8-19 2015', 40);
addLocation(50.94149, 6.94651, 'Cologne Furdance', 'www.cologne-cfd.de', 'Zeughaus24, Zeughausstraße 24, 50667 Köln, Germany', '', 'Jul 30 2016', 201); //Colonge Fur-Dance, Germany, June/November
addLocation(42.930358, -81.218609, 'Condition', 'www.conditionfurry.ca', 'Four Points Sheraton<br>1150 Wellington Road South<br>London, Ontario N6E 1M3<br>Canada', '+1 (519) 681-0600', 'Aug 1-3 2014', 251);
addLocation(-37.825497,144.951725, 'ConFurgence', 'confurgence.com', 'Hilton South Wharf<br>2 Convention Centre Place<br>South Wharf, Melbourne<br>Australia 3006', '+61-3-9027-2000', 'Jan 8-10 2016', 544);
addLocation(52.450713,  -1.715519, 'ConFuzzled', 'confuzzled.org.uk', 'Hilton Birmingham Metropole<br>National Exhibition Centre<br>Birmingham B40 1PP<br>United Kingdom', '+44 (0)121 780-4242', 'May 27-31 2016', 1228);
addLocation(42.150821, -87.911611, 'Duckon', 'www.duckon.org', 'Westin Chicago North Shore<br>601 N. Milwaukee Avenue<br>Wheeling, IL 60090<br><br>United States', '+1 (847) 777-6500', 'Jun 19-21 2015');
addLocation(51.689585, 11.274526, 'EAST', 'www.east-convention.de.vu', 'DJH Falkenstein/Harz<br>Falkensteiner Weg 2b<br>06463 Falkenstein/Harz<br>Germany', '+49 034743 8257', 'Sep 19-22 2013');
addLocation(28.33704,-81.587777, 'Elliott\'s Live Events', 'ele.furryhost.com', 'Radisson Resort Worldgate<br>3011 Maingate Lane, Kissimmee, FL 34747, United States','', "Year-round", 215);//May21-23, Aug7-8, Oct30-31
addLocation(52.129813, 11.631281, 'Eurofurence', 'eurofurence.org', 'Maritim Hotel Magdeburg<br>Otto-von-Guericke-Straße 87<br>39104 Magdeburg<br>Germany', '+49 (0) 3915949-0', 'Aug 17-21 2016', 1376);
addLocation(37.247901,-93.259639, 'F3 Convention', 'www.f3con.com', 'Lamplighter Inn & Suites, North<br>2820 N Glenstone Ave<br>Springfield, MO 65803<br>USA', '+1 (417) 869-3900', 'Nov 20-23 2014', 55);
addLocation(38.9608308, -77.425447, 'FA: United', 'faunited.org', 'Hyatt Regency Dulles<br>2300 Dulles Corner Blvd.<br>Herndon, Virginia 20171<br>USA', '+1 703 713 1234', 'Sep 11-13 2015', 658);
addLocation(35.91979, -84.088551, 'Fangcon', 'fangcon.org', 'Holiday Inn Knoxville West<br>9134 Executive Park Dr<br>Knoxville, TN 37923<br>USA', '+1 (865) 693-1011', 'Nov 7-9 2014', 302);
addLocation(45.880449, -78.564606, 'Feral!', 'campferal.org', 'Camp Arowhon<br>Algonquin Park, Ontario P1H 2G6<br>Canada', '+1 (705) 633-5651', 'Aug 25-29 2016', 94);
addLocation(60.412912, 25.038261, 'FinFur Animus', 'animus.finfur.net', 'Kokoushotelli Gustavelund, Tuusula, Finland', '', 'Mar 19-22 2015', 124);
addLocation(62.02209, 30.0185, 'FinFur Summer Camp', 'ffsc.finfur.net', '', '', 'Jul 11-15 2012');
addLocation(35.454262,139.638556, 'Fullmoff', 'www.fullmoff.com', 'Yokohama World Porters<br>2-2-1 Shinko, Naka-ku, <br>Yokohama, Kanagawa <br>Japan', '', 'Oct 25 2014', 0);
addLocation(43.027227, -88.108102, 'Fur Squared', 'http://www.fursquared.com/', 'Sheraton Milwaukee Brookfield Hotel<br>375 S Moorland Rd<br>Brookfield, WI 53005<br>USA', '+1 (262) 364-1100', 'Feb 27- Mar 1 2015', 415);
addLocation(-41.239835,174.980063, 'FurcoNZ', 'www.furconz.org.nz', 'Brookfield Outdoor Education Centre<br>Wainuiomata<br>Wellington<br>New Zealand', '', 'Feb 5-8 2016', 50);
addLocation(-27.997818, 153.429297, 'FurDU', 'www.furdu.com', 'Outrigger Hotel Surfers Paradise<br>22 View Avenue,<br>Surfers Paradise, QLD 4217<br>Australia', '', 'May 27-29 2016', 563);
addLocation(53.541723, -113.625262, 'Fur-eh!', 'fureh.ca', 'Hilton Garden Inn<br>17610 Stony Plain Road<br>Edmonton, Alberta, T5S 1A2<br>Canada', '+1 (780) 443-2233', 'May 6-8 2016', 200);
addLocation(-33.859972, 151.211111, 'FurJam', 'www.furjam.org', ' Forresters Hotel<br>336 Riley Street<br>Surry Hills NSW 2010<br>Australia', '(02) 9212 3035', 'Sept 20-28 2015');
addLocation(45.582910, -122.575732, 'Furlandia', 'furlandia.org/', 'Sheraton Hotel at PDX Airport <br>8235 NE Airport Way<br>Portland, Oregon 97220<br>USA', '+1 (503) 281-2500', 'May 27-29 2016', 348);
addLocation(39.983333, -82.983333, 'Furlaxation', 'furlaxation.org', 'Columbus, Ohio', '', 'Sep 12-14 2014', 241); //attendance for 2012
addLocation(28.542401, -81.347945, 'Furloween', 'www.furhold.org/furloween', 'Orlando Elks Lodge<br>12 North Primrose Dr.<br>Orlando, Florida 32803<br>USA', '+1 (407) 282-3900', 'Oct 25 2014', 188);
addLocation(43.689551, -79.586356, 'Furnal Equinox', 'furnalequinox.com', 'Sheraton Toronto Airport Hotel & Conference Centre<br>801 Dixon Road<br>Toronto, ON M9W 1J3<br>Canada', '+1 (416) 675-6100', 'Mar 18-20 2016', 750);
addLocation(41.604459, -72.700497, 'Furpocalypse', 'furpocalypse.org', 'Crowne Plaza Cromwell<br>100 Berlin Road<br>Cromwell, CT 06416<br>USA', '+1 (888) 233-9527', 'Oct 28-Oct 30 2016', 1200);
addLocation(43.156351,-77.610020, 'FurryCon', 'www.furrycon.com/', 'Radisson Riverside Rochester<br>120 E Main st<br>Rochester, New York<br>USA', '+1 (585) 546-6400', 'Sept 15-18 2015', 0);
addLocation(28.401971, -80.618792, 'Furry Cruise', 'www.furrycruise.com', 'Royal Caribbean\'s <i>Freedom of the Seas</i><br>Port Canaveral, Florida<br>USA', '+1 (734) 340-4553', 'Nov 9-16 2014', 24);
addLocation(32.956825, -96.822896, 'Furry Fiesta', 'www.furryfiesta.org', 'Intercontinental Dallas Hotel<br>15201 Dallas Pkwy<br>Addison, Texas 75001<br>USA', '+1 (972) 386-6000', 'Mar 24-26 2017', 2820);
addLocation(1.2987509, 103.8482675, 'Furry Lah', 'furrylah.com', 'Bayview Hotel Singapore<br>30 Bencoolen St<br>Singapore 189621', '+65 6337 2882', 'Nov 28-29 2015');
addLocation(44.86092, -93.23923, 'Furry Migration', 'www.furrymigration.org', 'Ramada Mall of America<br>American Blvd E<br>Bloomington, MN 55425<br>USA', '+1 952-854-3411', 'Sept 9-11 2016', 543);
addLocation(33.761999, -84.383352, 'Furry Weekend Atlanta', 'furryweekend.com', 'Atlanta Marriott Marquis<br>265 Peachtree Center Ave NE<br>Atlanta, GA 30303<br>USA', '+1 (404) 521-0000', 'Mar 31-Apr 3 2016', 2488);
addLocation(52.775556,   6.801771, 'Furry Weekend Holland', 'furryweekend.nl', 'Het Labyrint<br>Brink 9 7841 CE<br>Sleen<br>Netherlands', '', 'Mar 18-21 2016', 57);
//addLocation(51.40328, 5.95940, 'Furs on Fire', 'www.fursonfire.eu', 'Evertsoord, The Netherlands', '', 'Dec 29-Jan 1 2013', 66); //ended in 2013.
addLocation(37.036680,-76.382842, 'FursonaCon', 'http://www.fursonacon.com/', 'Hampton Roads Convention Center<br>1610 Coliseum Dr<br>Hampton, Virginia<br>USA', '+1 (757) 315-1610', 'Mar 18-20 2016', 0);
addLocation(52.588333, 14.65, 'Furstock', 'www.polfurs.org', '', '', 'Jul 31-Aug 2 2014', 45);
addLocation(57.05, 9.916667, 'Furtastic', 'www.furtastic.dk', 'Denmark', '', 'Jul 4-7 2016');
addLocation(37.330294,-121.888375, 'Further Confusion', 'furtherconfusion.org', 'San Jose Mariott<br>301 South Market Street<br>San Jose, CA 95113<br>USA', '+1 408-280-1300', 'Jan 14-18 2016', 3560);
addLocation(51.388923,-115.784912, 'Furthest North', 'furthestnorth.ca', 'Deer Creek Provincial Recreation Area<br>Alberta<br>Canada', '+1 (403) 637-2229', 'Sept 4-7 2015', 63);
addLocation(3.030592,101.716738, 'Furum', 'furum.org', 'Mines Wellnes Hotel<br>Jalan Dulang Off The Darul Ehsan<br>Balakong, 43300 Seri Kembangan<br>Selangor<br>Malaysia', '+60 3-8943 6688', 'Dec 19-20 2015');
addLocation(53.407281,-2.989201, 'FurVention', 'furvention.org.uk', 'Aloft Liverpool<br>1 North John Street<br>Liverpool, L2 5QW<br>United Kingdom', '+44 151 294 3970', '22-24 Jan 2016', 64);
addLocation(35.559328, 139.723602, 'Fur-st', 'fur-st.com', '志ら井<br>1 Chome-20-28 Minamikamata<br>Ota, Tokyo<br>Japan', '', 'Oct 18 2014', 144);
addLocation(39.283286,-84.466442, 'Fur Reality', 'www.furreality.org', 'Atrium Hotel<br>30 Tri-County Parkway<br>Cincinnati, OH 45246<br>USA', '513 771 7171', 'Oct 7-9 2016', 316);
addLocation(38.930864,-77.245601, 'Fur the \'More', 'furthemore.org', 'Sheraton Premiere at Tysons Corner<br>8661 Leesburg Pike<br>Vienna, VA<br>USA', '+1 (410) 785-7000', 'Apr 8-10 2016', 714);
addLocation(51.93180, 19.407, 'Futerkon', 'futerkon.pl', 'Municipal Cultural Center<br>95-001 Dzierżązna<br>Poland', '42 717 84 66', 'Aug 10-14 2016', 93);
addLocation(49.8954237, 5.080949, 'Fuzzcon', 'fuzzcon.be', 'Au pays de mon pere<br>Rue des Combattants 1<br>6850 Paliseul<br>Belgium', '', 'Aug 22-25 2013', 14);
addLocation(38.6329283, -90.184827, 'Gateway Furmeet', 'gatewayfurmeet.org', 'Lumière Place Casino and Hotels<br>999 N 2nd St<br>St. Louis, Missouri 63119<br>USA', '+1 (314) 881-7777', 'May 13-15, 2016', 223);
addLocation(54.358288, 18.621243, 'Gdakon', 'gdakon.org', 'Amber Hotel<br>Gdańsk<br>Poland', '', 'March 9-13 2016', 157);
addLocation(42.404360,-86.243710, 'Great Lakes Fur Con', 'http://greatlakesfurcon.com/', 'Holiday Inn Express South<br>1741 Phoenix Rd<br>South Haven, MI 49090<br>USA', '+1 (269) 637-8800', 'May 27-29 2016', 264);
addLocation(47.35016, 7.76123, 'Golden Leaves Con', 'glc.furry.ch', 'Baselbieter Chinderhus<br>Bachtalenstrasse 10<br>4438 Langenbruck<br>Switzerland', '062 390 12 24', 'Oct 29-Nov 1 2015');//
//addLocation(52.505369,  13.353882, 'Herbstcon', 'herbstcon.de', 'Sozialistische Jugend Deutschlands – Die Falken<br>Haus am Lützowplatz<br>Lützowplatz 9<br>10785 Berlin<br>Germany', '+49 030-261030-0', 'Oct 11-14 2012', 20);//Invite only
addLocation(49.616848,   8.826463, 'H-Con', 'h-con.afc-group.org', 'Gerhart-Hauptmann-Haus<br>Außerhalb 1-3<br>64689 Grasellenbach-Scharbach<br>Germany', '+49 06 2 07/1 22-1', 'Oct 3-7 2012', 50);
addLocation(49.26716,-123.010021, 'Howloween', 'howloween.ca', 'Burnaby Executive Hotel<br>4201 Lougheed Highway<br>Burnaby, BC<br>Canada', '', 'Nov 7 2015', 202);
addLocation(38.866200,  -0.406165, 'Ibercamp', 'ibercamp.es', 'Salem, Valencia<br>Spain', '', 'Oct 11-13 2013');
addLocation(25.034847, 121.546979, 'Infurnity', 'infurnity.com', 'SMAJO House<br>Ln. 279, Sec. 1, Fuxing S. Rd.<br>Da’an Dist., Taipei', '', 'Oct 31 2015', 0); // first Taiwan furcon
addLocation(39.768971, -86.160601, 'IndyFurCon', 'indyfurcon.com', 'Sheraton at Keystone Crossing<br>8787 Keystone Crossing<br>Indianapolis, IN 46240<br>USA', '+1 (317) 846-2700', 'Aug 26-28 2016', 527);
addLocation(34.743463, 137.370965, 'Japan Meeting of Furries', 'www.j-mof.org', 'Loisir Hotel Toyohashi<br>141 Fujisawacho<br>Toyohashi, Aichi<br>Japan', '', 'Jan 8-10 2016', 400);
addLocation(25.00814, 121.53604, 'Kemono & Jingai Only 2', 'jk2016.furry.tw', 'Jhongjheng Hall<br>88 Tingzhou Road Section 4<br>Wenshan District<br>Taipei City 116<br>Taiwan<br>116台北市文山區汀州路四段88號', '', 'Jul 16 2016', null); // The name of the hall at http://en.ntnu.edu.tw/gongguan-campus.php#tab-1 seems to be in Tongyong Pinyin, while the street address seems to be in Hanyu Pinyin?
addLocation(35.3334755,139.9891955, 'Kemocon', 'www.kemocon.com', 'Kasuza Akademia Hall<br>2 Chome-3-9 Kazusakamatari<br>Kisarazu, Chiba Prefecture<br>Japan', '', 'Nov 22-23 2014', 420);
addLocation(34.985692,138.417148, 'Kemono Square', 'eixinweb.jp/kemono-square.html', 'Shizuoka Convention & Arts Center "Granship" 7F<br>79-4 Ikeda, Suruga Ward, Shizuoka City<br>Japan', '', 'Jun 6 2015', 107);
addLocation(35.654685,139.761096, 'Kemoket', 'kemoket.com', 'Tokyo Metropolitan Industrial Trade Center Hamamastucho-kan<br>1 Chome-7-8 Kaigan<br>Minato, Tokyo<br>Japan', '', 'Apr 29 2014', 0);  //259 vendors from 246 circles confirmed for 2014
addLocation(34.6693, 135.476103, 'Kemoket', 'kemoket.com', 'Sky Hall D Block<br>Osaka Dome<br>Osaka<br>Japan', '', 'Oct 13 2014', 0);
addLocation(35.1584991, 136.9298391, 'Kigukemo', 'kigukemo.jp', 'Nagoya Trade & Industry Center <br>2-6-3 Fukiage<br>Chikusa Ward, Nagoya, Aichi<br>Japan ', 'Phone Number', 'Aug 29, 2015', 141); //only attendees signed up from Twipla
addLocation(47.336284,  12.855555, 'Lakeside Furs', 'lakesidefurs.at', 'Zell am See<br>Talstr. 159, 5700 Thumersbach<br>Austria', '+43 (0)6542/73734', 'Jul 9-16 2016', 40);
addLocation(28.455824, -81.306028, 'Megaplex', 'megaplexcon.org', 'Orlando Airport Marriott<br>7499 Augusta National Drive<br>Orlando, FL 32822<br>USA', '+1 (407) 851-9000', 'Aug 5-Aug 7 2015', 1281);
addLocation(34.966572, -89.791608, 'Mephit Furmeet', 'mephitfurmeet.org', 'Whispering Woods Hotel & Conference Center<br>11200 Goodman Rd<br>Olive Branch, MS 38654-4212<br>USA', '+1 (662) 895-2941', 'Sep 2-Sep 4 2016', 548);
addLocation(50.825484,   7.887068, 'Mephit Mini Con', 'mmc.furcon.de', 'Freusburg, Seigen<br>Germany', '', 'Apr 30-May 3 2015', 200);
addLocation(35.6568544, 139.7351909, 'Metamore Generation V', 'www.metamor.jp/', 'Village<br>B1F, Fukao Bldg. 1-4-5 Azabu-juban, Minato-ku, Tokyo, Japan', '', 'Oct 5 2013', 0);
addLocation(41.981284, -87.859078, 'Midwest FurFest', 'furfest.org', 'Hyatt Regency O\'Hare<br>9300 Bryn Mawr Avenue<br>Rosemont, Illinois 60018<br>USA', '+1 (847) 696-1234', 'Dec 5-7 2015', 3904);
addLocation(35.7549142, 139.7366338, 'Mofukai', 'twipla.jp/events/84157', '北とぴあ 14F　Sky Hall<br>1 Chome-11 Oji Kita Tokyo <br>Japan', '', 'May 2 2015', 66); //only attendees signed up from Twipla - 6 people over venue capacity
addLocation(13.705699, 100.604295, 'Morph Parade', 'fb.me/MOFU.PARADE', 'KV Mansion<br>90 สุขุมวิท 81 บางจาก<br>[Near BTS On-Nut station]<br>Bangkok 10260<br>Thailand', '+66 2-33 222 11', 'Nov 7 2015');
addLocation(42.443047, -83.435667, 'Motor City Furry Con', 'motorcityfurrycon.org', '21111 Haggerty Road<br>Novi, MI 48375<br>USA', '+1 (248) 349-4000', 'Apr 8-10 2016', 967);
addLocation(41.846166, -87.942571, 'New Year\'s Eve Con', 'newyearsevecon.com', 'Residence Inn Oak Brook<br>790 Jorie Boulevard<br>Oak Brook, IL 60523<br>USA', '+1 (630) 571-1200', 'Dec 31 2015-Jan 1 2016', 100);
addLocation(39.65924 , -75.75286, 'New Year\'s Furry Ball', 'www.ticketderby.com/innerindex.php?eventid=3505', 'Embassy Suites Newark-Wilmington/South<br>854 S College Ave<br>Newark, DE 19713<br>USA', '(302) 368-8000', 'Dec 31 2015-Jan 1 2016', 211) 
addLocation(58.9143217, 17.953672, 'NordicFuzzCon', 'nordicfuzzcon.org', 'Utsikten Meetings Hotel<br>Nynäshamn<br>Sweden', '', 'Mar 3-6 2016', 382);
addLocation(35.933888, -98.429604, 'Oklacon', 'oklacon.com', 'Roman Nose State Park<br>Rt 1 Box 2-2<br>Watonga, Oklahoma 73772<br>USA', '+1 (580) 623-4215', 'Oct 29-Nov 1 2014', 352);
addLocation(-31.944444,115.863842, 'FurWAG', 'furwag.com.au', 'Hotel Ibis Styles Perth<br>15 Robinson Avenue<br>Northbridge 6003<br>Western Australia', '+61 8 9328 0000', 'Sept 30-Oct 2 2016', 177);
addLocation(47.444579,-122.293807, 'RainFurrest', 'rainfurrest.org', 'Hilton Seattle Airport<br>17620 International Boulevard<br>Seattle, WA 98188<br>USA', '+1 (206) 244-4800', 'Sep 22-25 2016', 1424);
addLocation(-27.467778, 153.027778, 'RivFur', 'www.rivfur.org', 'Brisbane, Queensland, Australia', '', 'August 8-10, 2014', 180);
addLocation(34.6701,  -86.577759, 'Rocket City FurMeet', 'rcfm.net', 'Hilton Garden Inn Huntsville South<br>301 Boulevard South SW<br>Huntsville, Alabama 35802<br>USA', '+1 (256) 881-4170', 'May 24-26 2013', 242);
addLocation(39.762235,-104.900293, 'Rocky Mountain Fur Con', 'rockymountainfurcon.org', 'Doubletree Hotel Denver<br>3203 Quebec Street<br>Denver, Colorado 80207<br>USA', '+1 (303) 321-3333', 'Aug 12-14 2016', 863);
addLocation(56.050627,36.823576, 'Rusfurrence', 'rusfurrence.ru', 'РАН "Авантель Клаб Истра" (RAS "Avantel Club Istra")<br>ЗИстринское Водохранилище (Istra Reservoir), Moscow<br>Russian Federation', '', 'Feb 4-8 2015', 286);
addLocation(57.478307, -4.22672, 'ScotiaCon', 'www.scotiacon.com', 'Mercure Inverness Hotel<br>Church Street<br>Inverness, IV1 1QY<br>Inverness-shire, United Kingdom', '', 'Nov 7-9 2014', 123);
addLocation(31.27268, 121.55447, 'Shanghai Furry Summer Festival', 'weibo.com/5383289490', 'Jinqianbao Hotel<br>2866 Yangshupu Rd<br>Shanghai, China<br>中国上海市杨树浦路2866号金钱豹大酒店', '', 'Jul 23 2016', null); // co-located with Shanghai Jingai Only 2016. At the Golden Leopard hotel. Mirror for Weibo account: http://ent.sina.com.tw/weibo/user/5383289490
addLocation(-26.201, 28.046, 'South Afrifur meet', 'forum.zafur.co.za/viewtopic.php?f=53&t=1330', '', '', 'Dec 2012?', 0);
addLocation(40.769163,-111.897349, 'Unthrocon', 'www.unthrocon.org', ' Salt Lake City Radisson Hotel<br>215 W South Temple<br>Salt Lake City, Utah 84101<br>USA', '+1 (801) 531-7500', 'Oct 31-Nov 2 2014', 126);
addLocation(49.266323,-123.011509, 'VancouFur', 'vancoufur.ca', 'Executive Hotel & Conference Centre Burnaby<br>4201 Lougheed Hwy<br>Burnaby, British Columbia, V5C 3Y6<br>Canada', '', 'Mar 3-6 2016', 600);
addLocation(45.499474, -73.562801, 'What The Fur', 'whatthefur.ca', 'Delta Centre-Ville<br>777 University Street<br>Montreal, Quebec<br>H3C 3Z7, Canada', '+1 (514) 879-1370', 'May 20-22 2016', 303);
addLocation(40.4612,-79.7509, 'Western Pennsylvania Furry Weekend', 'wpafw.org', ' North Park Lodge, N Ridge Dr<br>Allison Park, PA 15101<br>USA', '+1 (724) 327-0338', 'Oct 7-9 2016', 132);
addLocation(35.042611, -95.317672, 'Wild Nights', 'wildnights.org', 'Robbers Cave State Park<br>Wilburton, Oklahoma 74578<br>USA', '+1 (918) 465-2565', 'Apr 21-26 2016', 302);
addLocation(50.456309, 30.504819, 'WUFF', 'wuff.org.ua/2015', 'Hotel «Sofiyevsky Posad»<br>81/2 Kyivs\'ka Str., Sofiivs\'ka Borshchahivka<br>Kiev, Ukraine', '', 'May 6-10 2015', 260)
addLocation(44.520806, 11.401609, 'Zampacon', 'zampacon.forumfree.it', 'Ostello SanSisto<br>via Viadagola 5<br>Bologna, 40127<br>Italy', '', 'Sep 3-7 2014', 39);
addLocation(47.503095, 12.190969, 'Zillercon', '', 'Wörgl, Tyrol<br>Austria', '', 'Jan 25-Feb 1 2014', 40);
addLocation(50.773040, 15.311701, 'ZodiaCon', 'zodiacon.org', 'Hotel Emilka<br>Na Novině 401<br>468 61 Desná III<br>Czech Republic', '+420 483 300 335', 'May 30-June 2, 2014', 74);
addLocation(-23.668839,-46.577533, 'Furboliche 6', 'furboliche.com.br', 'Bomboliche Extra Anchieta<br>R. García Lorca, 301<br>S&atilde;o Bernardo do Campo (SP)<br>Brazil', '','Dec 3, 2016', 261);

// convert textual dates to numbers for sorting.
for(var i = 0, meet; meet = meets[i]; i++){
	meet.datev=(v=getmonthvalue(meet.date))?v:3000;
}

// adds or rearranges meets in the side bar.
function refresh(f){
	for(var i = 0, meet; meet = meets[i]; i++){
		addLocation1(meet, f);
	}
}

// comparison functions, those decide the order meetups are listed
function compare_name(a, b){
	return a.name?(b.name?a.name.localeCompare(b.name):-1):1;
}
function compare_date(a,b){
	var d = a.datev - b.datev;
	return (d == 0)? compare_name(a, b) : d;
}
function compare_attendance(a,b){
	if (a.attendance){
		if (b.attendance){
			return b.attendance - a.attendance;
		} else {
			return -1;
		}
	} else {
		if (b.attendance){
			return 1;
		} else {
			return compare_name(a,b);
		}		
	}
}
// assigning functionality to sort buttons
document.getElementById("bydate").onclick=function(){
	meets.sort(compare_date);
	refresh(function(meet){return meet.date?(meet.date + " " + meet.name):meet.name;});
	}
document.getElementById("byname").onclick=function(){
	meets.sort(compare_name);
	refresh();
	}
document.getElementById("byattendance").onclick=function(){
	meets.sort(compare_attendance);
	refresh(function (meet){return meet.name + (meet.attendance?" ("+meet.attendance+")":"");});
	}

meets.sort(function (a,b){
	return a.datev - b.datev;
	})
refresh(function(meet){return meet.date?(meet.date + " " + meet.name):meet.name;});

// add drop-down options
opt = document.createElement("option");
opt.innerHTML = "Everywhere ("+count+")";
opt.value = FILT_ALL;
opt.selected=true;

document.getElementById("filter").appendChild(opt);

opt = document.createElement("option");
opt.innerHTML = "North America ("+count_na+")";
opt.value = FILT_NA;

document.getElementById("filter").appendChild(opt);

opt = document.createElement("option");
opt.innerHTML = "Europe ("+count_eu+")";
opt.value = FILT_EU;

document.getElementById("filter").appendChild(opt);

opt = document.createElement("option");
opt.innerHTML = "Oceania ("+count_oceania+")";
opt.value = FILT_OCEANIA;

document.getElementById("filter").appendChild(opt);

opt = document.createElement("option");
opt.innerHTML = "Japan ("+count_japan+")";
opt.value = FILT_JAPAN;

document.getElementById("filter").appendChild(opt);

opt = document.createElement("option");
opt.innerHTML = "Rest of the World ("+count_others+")";
opt.value = FILT_OTHERS;

document.getElementById("filter").appendChild(opt);

document.getElementById("filter").onchange = function(){
    opts = document.getElementById("filter").firstChild;
    selection = 0;
    while(opts != null){
        if (opts.selected) {
            selection = opts.value;
        }
        opts = opts.nextSibling;
    }

    filter_func = null;
    switch(Number(selection)){
        case FILT_NA:
            filter_func = is_in_na; break;
        case FILT_EU:
            filter_func = is_in_eu; break;
        case FILT_OCEANIA:
            filter_func = is_in_oceania; break;
        case FILT_JAPAN:
            filter_func = is_in_japan; break;            
        case FILT_OTHERS:
            filter_func = function(lat, lng){
                return !(is_in_na(lat, lng)) && 
                            !(is_in_eu(lat, lng)) && 
                            !(is_in_oceania(lat, lng)) && 
                            !(is_in_japan(lat, lng))
                ;
            }
            break;
        case FILT_ALL:
        default:
            filter_func = function(lat, lng){return true;}
            break;
    }

    bounds = null;
    for(var i = 0, meet; meet = meets[i]; i++){

        //only show those that pass filter_func
        visible = filter_func(meet.lat, meet.lng);
        //meet.marker.setVisible(visible);
        meet.li.style.display = visible ? "": "none";

        if (visible) {
            if (bounds){
                bounds.extend(meet.marker.getLatLng());
            } else {
            pos = meet.marker.getLatLng();
            bounds = L.latLngBounds(pos, pos);
            }
        }
    }
    if (bounds) {map.fitBounds(bounds);} //zoom to include in the viewport all markers if there are any
}
} //if (true)
footnote = document.createElement("p");
footnote.innerHTML = '<a href="//pool.wikifur.com/w/index.php?title=Convention_map_script&action=edit">Edit data on WikiFur</a> or <a href="//pool.wikifur.com/wiki/Talk:Convention_map_script">discuss</a>';
document.getElementById("side").appendChild(footnote);
} //load()

// convert textual dates into numbers for sorting
// Might benefit from also parsing years.
function getmonthvalue(s){
	if (!s) {return 4001;}

	//automatically generate these for i18n and l10n extensibility?
	x = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[A-Za-z]*(?: )?([0-9]*)/.exec(s);
	if (!x || !x[1]) return 4000;
	day = (v=parseInt(x[2]))?v:0;
	if (day > 1980) {day = 40;}
	switch (x[1]){
		case "Jan": month = 1; break;
		case "Feb": month = 2; break;
		case "Mar": month = 3; break;
		case "Apr": month = 4; break;
		case "May": month = 5; break;
		case "Jun": month = 6; break;
		case "Jul": month = 7; break;
		case "Aug": month = 8; break;
		case "Sep": month = 9; break;
		case "Oct": month = 10; break;
		case "Nov": month = 11; break;
		case "Dec": month = 12; break;
		default:	month = 20;
	}//switch
	return month * 100 + day;
}

//returns the text to be displayed in info window
function getLocationHTML(name, url, address, tel, date, attendance) {
  return '<p><b><a href="//en.wikifur.com/wiki/' + name + '">' + name + '</a></b>' + 
	(url?('<br><a href="http://' + url + '">' + url + '</a>'):'') + '</p><p class="smaller">' +
	address +
	 (tel?
		('<br>Phone: ' + 
			(is_phone? 
				('<a href="tel:' + tel.replace(/\s/g, "") + '">' + tel + '</a>')
				:tel))
		:'') + 

	(date?'<br>'+date:'') +
	(attendance? " Past atnd. "+ attendance:"") +
	"</p>";

}

function addLocation(lat, lng, name, url, address, tel, date, attendance){
meets.push({'lat':lat, 'lng': lng, 'name':name, 'url': url, 'address': address, 'tel': tel, 'date':date, 'attendance': attendance});
}

//this is called to add markers as well as to sort markers.
//this takes advantage of the fact that when adding a child to a DOM node, if the child is already in the document, it is removed from its original location first.
//lat, lng, name, url, address, tel, date, attendance
function addLocation1(a, f) {
    if (!f) {f = function(meet){return meet.date? (meet.name + " " + meet.date) : meet.name;}};
    if (!a.marker || !a.li){

        //make the marker
        markerOpts = {
        }

        //markerOpts.icon = (a.attendance >= 1000 ? redIcon : (a.attendance >= 200 ? purpleIcon : blueIcon ) );
//        markerOpts.shadow = markerShadow;
        markerOpts.title = a.name;

        a.marker = L.marker([a.lat, a.lng], markerOpts);
        fn =  function() {
            if(!map.getBounds().contains([a.lat, a.lng])){
                map.panTo([a.lat, a.lng]);
            }
            a.marker.bindPopup(getLocationHTML(a.name, a.url, a.address, a.tel, a.date, a.attendance));
            a.marker.openPopup();
        }
        a.marker.on("click",fn);
        a.marker.addTo(map);
        
        link = document.createElement("A");
        link.innerHTML = f(a);
	    link.href = "#";
        link.onclick = fn;
        
        //clean up this on unload!
        a.li = document.createElement("LI");
        a.li.appendChild(link);

        count++;
        if      (is_in_na(a.lat, a.lng)){
            count_na++;
        } else if (is_in_eu(a.lat, a.lng)) {
            count_eu++;
        } else if (is_in_oceania(a.lat, a.lng)){
            count_oceania ++; 
        } else if (is_in_japan(a.lat, a.lng)) {
	    count_japan ++; 
        } else {
            count_others ++;
        }
    } else {
        //only change the label text
        a.li.firstChild.innerHTML = f(a);
    }
          //(re)insert the item into list
          document.getElementById("list").appendChild(a.li);

}

function unload(){
    for(var i = 0, meet; meet = meets[i]; i++){
	    meet.marker=null;
	    meet.li=null;
    }

}
//</pre>


