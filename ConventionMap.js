// This powers the <span class="plainlinks">[http://en.wikifur.com/FurryConventionMap.html map of active conventions]</span>. Edit events in the "Add map points" section below. 

// To get latitude and longitude, find the target on Google Maps, then click the link button, copy it into a text editor (like Notepad), and use the numbers after 'll='. 

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

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

infoWindow = L.popup({});

// Add map points
// Format: addLocation(latitude, longitude, 'Name', 'website', 'Place name<br>Street<br>City, State Code<br>Country', 'Phone Number', 'Mon[th] 1-3 20XX', attendance);
addLocation(-24.265278,-48.406944, 'Abando', 'abando.com.br', 'Parque Estadual Intervales<br>São Roque, São Paulo<br>Brazil', '', 'Mar 1-4 2013', 55);
//addLocation(-37.891950, -57.832850, 'Animales Sueltos', 'furrycamp.com.ar', 'Camping \'La Serranita\'<br>barrio Colinas Verdes<br>Mar del Plata<br>Argentina', '', 41);
addLocation(40.444334, -79.995532, 'Anthrocon', 'www.anthrocon.org', 'Westin Convention Center Pittsburgh<br>1000 Penn Avenue<br>Pittsburgh, Pennsylvania 15222<br>USA', '+1 (412) 281-3700', 'Jul 3-6 2014', '5577');
addLocation(52.597652, 13.22226, 'BerliCon', 'www.berlicon.org', 'Zeltlagerplatz e.V.<br>Rallenweg 4,13505 Berlin-Heiligensee<br>Germany', '', '20-23 Jun 2013', 35);
addLocation(39.523177, -119.78106, 'Biggest Little Fur Con', 'www.biggestlittlefurcon.org', 'Grand Sierra Resort<br>2500 East 2nd Street<br>Reno, Nevada 89595<br>USA', '+1 (77) YEAH-BLFC', 'Mar 28-30 2014', '704');
//addLocation(61.599498,   9.750860, 'CabinCon', 'swandog.livejournal.com', 'Vinstra<br>Norway', '');//not on list, website is private
//addLocation(39.077092, -74.830348, 'Cape May Fur Meet', 'capemayfurmeet.com', 'Middle Township Elementary School #2<br>101 West Pacific Ave, Cape May Court House<br>Middle, New Jersey 08210<br>USA', '', 'May 19-20 2012', 3);
addLocation(33.679673,-117.852488, 'Califur', 'califur.com', 'Irvine Marriott<br>18000 Von Karman Avenue<br>Irvine, California, 92614<br>USA', '+1 (949) 553-0100', 'May 30-Jun 1 2014', 1178);
addLocation(43.721056,-121.291552, 'Campfire Tails', 'campfiretails.com', 'Ogden Group Camp C<br>Paulina Lake<br>La Pine, Oregon<br>USA', '', 'Aug 1-5 2012', 143);
//addLocation(44.858188, -93.221054, 'Cat Days', 'www.mnfurs.org/cat-days', 'Crowne Plaza Hotel and Suites<br>Minneapolis International Airport<br>Appletree Square<br>Bloomington, MN 55425<br>USA', '+1 877-859-5095', 'Aug 3-4 2012');
//addLocation(38.9439, -95.3385, 'Central Midwest Furmeet', 'cmfurmeet.webs.com', ' Bloomington West Group Camp at Clinton Lake near Lawrence, Kansas', '', 'Sep 14-16 2012', 22);
addLocation(49.638649,  15.298977, 'ČeSFuR', 'www.cesfur.org', 'Hotel Luna<br>Kouty 77<br>584 01 Kouty<br>Czech Republic', '', 'Jun 27-30 2013', 107);
addLocation(50.94149, 6.94651, 'Cologne Furdance', 'www.cologne-cfd.de', 'Zeughaus24, Zeughausstraße 24, 50667 Köln, Germany', '', 'Nov 10 2012'); //Colonge Fur-Dance, Germany, June/November
addLocation(42.930358, -81.218609, 'Condition', 'www.conditionfurry.ca', 'Four Points Sheraton<br>1150 Wellington Road South<br>London, Ontario N6E 1M3<br>Canada', '+1 (519) 681-0600', 'Aug 2-4 2013', 251);
addLocation(-37.825497,144.951725, 'ConFurgence', 'confurgence.com', 'Hilton South Wharf<br>2 Convention Centre Place<br>South Wharf, Melbourne<br>Australia 3006', '+61-3-9027-2000', 'Jan 10-12 2014', 474);
addLocation(52.450713,  -1.715519, 'ConFuzzled', 'confuzzled.org.uk', 'Hilton Birmingham Metropole<br>National Exhibition Centre<br>Birmingham B40 1PP<br>United Kingdom', '+44 (0)121 780-4242', 'May 23-27 2014', 873);
addLocation(42.150821, -87.911611, 'Duckon', 'www.duckon.org', 'Westin Chicago North Shore<br>601 N. Milwaukee Avenue<br>Wheeling, IL 60090<br><br>United States', '+1 (847) 777-6500', 'Jun 6-8 2013');
addLocation(51.689585, 11.274526, 'EAST', 'www.east-convention.de.vu', 'DJH Falkenstein/Harz<br>Falkensteiner Weg 2b<br>06463 Falkenstein/Harz<br>Germany', '+49 034743 8257', 'Sep 19-22 2013');
addLocation(28.33704,-81.587777, 'Elliott\'s Live Events', 'ele.furryhost.com', 'Radisson Resort Worldgate<br>3011 Maingate Lane, Kissimmee, FL 34747, United States','', "Year-round", 215);//May21-23, Aug7-8, Oct30-31
addLocation(52.129813, 11.631281, 'Eurofurence', 'eurofurence.org', 'Maritim Hotel Magdeburg<br>Otto-von-Guericke-Straße 87<br>39104 Magdeburg<br>Germany', '+49 (0) 3915949-0', 'Aug 21-25 2013', 1376);
addLocation(40.703546, -74.184279, 'FA: United', 'faunited.org', 'Hanover Marriott<br>1401 Rt 10 E<br>Whippany, NJ 07981<br>USA', '+1 (973) 538 8811 ', 'Aug 17-19 2012', 629);
addLocation(35.91979, -84.088551, 'Fangcon', 'fangcon.org', 'Holiday Inn Knoxville West<br>9134 Executive Park Dr<br>Knoxville, TN 37923<br>USA', '+1 (865) 693-1011', 'Nov 07-09 2014', 231);
addLocation(45.880449, -78.564606, 'Feral!', 'campferal.org', 'Camp Arowhon<br>Algonquin Park, Ontario P1H 2G6<br>Canada', '+1 (705) 633-5651', 'Aug 24-28 2012', 94);
addLocation(62.02209, 30.0185, 'FinFur', 'ffsc.finfur.net', '', '', 'Jul 11-15 2012');
addLocation(35.454262,139.638556, 'Fullmoff', 'www.fullmoff.com', 'Yokohama World Porters<br>2-2-1 Shinko, Naka-ku, <br>Yokohama, Kanagawa <br>Japan', '', 'Oct 25 2014', 0);
addLocation(-41.239835,174.980063, 'FurcoNZ', 'www.furconz.org.nz', 'Brookfield Outdoor Education Centre<br>Wainuiomata<br>Wellington<br>New Zealand', '', 'Feb 6-9 2014', 50);
addLocation(-28.00041, 153.4264, 'FurDU', 'www.furrydownunder.com', 'Vibe Hotel Gold Coast<br>42 Ferny Avenue,<br>Surfers Paradise, QLD 4217<br>Australia', '', 'Apr 27-29 2012', 246);
addLocation(53.541723, -113.625262, 'Fur-eh!', 'fureh.ca', 'Hilton Garden Inn<br>17610 Stony Plain Road<br>Edmonton, Alberta, T5S 1A2<br>Canada', '+1 (780) 443-2233', 'May 4-6 2012', 200);
addLocation(-33.859972, 151.211111, 'FurJam', 'www.furjam.org', ' Forresters Hotel<br>336 Riley Street<br>Surry Hills NSW 2010<br>Australia', '(02) 9212 3035', 'Oct 7-9 2012');
addLocation(39.983333, -82.983333, 'Furlaxation', 'furlaxation.org', 'Columbus, Ohio', '', 'Sep 28-30 2012');
addLocation(28.542401, -81.347945, 'Furloween', 'www.furhold.org/furloween', 'Orlando Elks Lodge<br>12 North Primrose Dr.<br>Orlando, Florida 32803<br>USA', '+1 (407) 282-3900', 'Oct 27 2012', 148);
addLocation(43.689551, -79.586356, 'Furnal Equinox', 'furnalequinox.com', 'Sheraton Toronto Airport Hotel & Conference Centre<br>801 Dixon Road<br>Toronto, ON M9W 1J3<br>Canada', '+1 (416) 675-6100', 'Mar 8-10 2013', 750);
addLocation(28.401971, -80.618792, 'Furry Cruise', 'www.furrycruise.com', 'Royal Caribbean\'s <i>Freedom of the Seas</i><br>Port Canaveral, Florida<br>USA', '+1 (734) 340-4553', 'Dec 2-7 2012', 24);
addLocation(32.956825, -96.822896, 'Furry Fiesta', 'www.furryfiesta.org', 'Intercontinental Dallas Hotel<br>15201 Dallas Pkwy<br>Addison, Texas 75001<br>USA', '+1 (972) 386-6000', 'Feb 21-23 2014', 1492);
addLocation(44.86092, -93.23923, 'Furry Migration', 'www.furrymigration.org', 'Ramada Mall of America<br>American Blvd E<br>Bloomington, MN 55425<br>USA', '+1 952-854-3411', 'Sep 12-14 2014');
addLocation(33.761999, -84.383352, 'Furry Weekend Atlanta', 'furryweekend.com', 'Atlanta Marriott Marquis<br>265 Peachtree Center Ave NE<br>Atlanta, GA 30303<br>USA', '+1 (404) 521-0000', 'Apr 9-12 2015', 2488);
addLocation(52.775556,   6.801771, 'Furry Weekend Holland', 'furryweekend.nl', 'Het Labyrint<br>Brink 9 7841 CE<br>Sleen<br>Netherlands', '', 'Mar 15-18 2013', 57);
addLocation(51.40328, 5.95940, 'Furs on Fire', 'www.fursonfire.eu', 'Evertsoord, The Netherlands', '', 'Dec 29-Jan 1 2013', 66);
addLocation(52.588333, 14.65, 'Furstock', 'www.polfurs.org', '', '', 'Dec 30 2012-Jan 1 2013', 35);
addLocation(57.05, 9.916667, 'Furtastic', 'www.furtastic.dk', 'Denmark', '', 'Jul 2012?');
addLocation(37.330294,-121.888375, 'Further Confusion', 'furtherconfusion.org', 'San Jose Mariott<br>301 South Market Street<br>San Jose, CA 95113<br>USA', '+1 408-280-1300', 'Jan 16-20 2014', 3380);
addLocation(51.388923,-115.784912, 'Furthest North', 'furthestnorth.ca', 'Deer Creek Provincial Recreation Area<br>Alberta<br>Canada', '+1 (403) 637-2229', 'Aug 2-5 2013', 63);
addLocation(39.283286,-84.466442, 'Fur Reality', 'www.furreality.org', 'Atrium Hotel<br>30 Tri-County Parkway<br>Cincinnati, OH 45246<br>USA', '513 771 7171', 'Oct 11-13 2013');
addLocation(39.494658,-76.66367, 'Fur the \'More', 'furthemore.org', 'Hunt Valley Inn<br>245 Shawan Rd<br>Baltimore, MD<br>USA', '+1 (410) 785-7000', 'Mar 14-16 2014');
addLocation(51.93180, 19.407, 'Futerkon', 'futerkon.pl', 'Municipal Cultural Center<br>95-001 Dzierżązna<br>Poland', '42 717 84 66', 'Aug 8-11 2013', 93);
addLocation(49.8954237, 5.080949, 'Fuzzcon', 'fuzzcon.be', 'Au pays de mon pere<br>Rue des Combattants 1<br>6850 Paliseul<br>Belgium', '', 'Aug 22-25 2013');
addLocation(47.35016, 7.76123, 'Golden Leaves Con', 'glc.furry.ch', 'Baselbieter Chinderhus<br>Bachtalenstrasse 10<br>4438 Langenbruck<br>Switzerland', '062 390 12 24', 'Nov 15-18 2012');//
//addLocation(52.505369,  13.353882, 'Herbstcon', 'herbstcon.de', 'Sozialistische Jugend Deutschlands – Die Falken<br>Haus am Lützowplatz<br>Lützowplatz 9<br>10785 Berlin<br>Germany', '+49 030-261030-0', 'Oct 11-14 2012', 20);//Invite only
addLocation(49.616848,   8.826463, 'H-Con', 'h-con.afc-group.org', 'Gerhart-Hauptmann-Haus<br>Außerhalb 1-3<br>64689 Grasellenbach-Scharbach<br>Germany', '+49 06 2 07/1 22-1', 'Oct 3-7 2012', 50);
addLocation(49.26716,-123.010021, 'Howloween', 'howloween.ca', 'Burnaby Executive Hotel<br>4201 Lougheed Highway<br>Burnaby, BC<br>Canada', '', 'Nov 10-12 2011', 182);
addLocation(38.866200,  -0.406165, 'Ibercamp', 'ibercamp.es', 'Salem, Valencia<br>Spain', '', 'Nov 24-25 2012');
addLocation(39.768971, -86.160601, 'IndyFurCon', 'indyfurcon.com', 'Sheraton at Keystone Crossing<br>8787 Keystone Crossing<br>Indianapolis, IN 46240<br>USA', '+1 (317) 846-2700', 'Aug 9-11 2013', 482);
addLocation(34.743463, 137.370965, 'Japan Meeting of Furries', 'www.j-mof.org', 'Loisir Hotel Toyohashi<br>141 Fujisawacho<br>Toyohashi, Aichi<br>Japan', '', 'Jan 10-11 2015', 232);
addLocation(35.3334755,139.9891955, 'Kemocon', 'www.kemocon.com', 'Kasuza Akademia Hall<br>2 Chome-3-9 Kazusakamatari<br>Kisarazu, Chiba Prefecture<br>Japan', '', 'Nov 22-23 2014', 420);
addLocation(34.985692,138.417148, 'Kemono Square', 'eixinweb.jp/kemono-square.html', 'Shizuoka Convention & Arts Center "Granship" 7F<br>79-4 Ikeda, Suruga Ward, Shizuoka City<br>Japan', '', 'Jun 7 2014', 0);
addLocation(35.654685,139.761096, 'Kemoket', 'kemoket.com', 'Tokyo Metropolitan Industrial Trade Center Hamamastucho-kan<br>1 Chome-7-8 Kaigan<br>Minato, Tokyo<br>Japan', '', 'Apr 29 2014', 0);
addLocation(34.6693, 135.476103, 'Kemoket', 'kemoket.com', 'Sky Hall D Block<br>Osaka Dome<br>Osaka<br>Japan', '', 'Oct 13 2013', 0);
addLocation(35.1584991,136.9298391, 'Kigukemo', 'kigukemo.jp', 'Nagoya Trade & Industry Center <br>2-6-3 Fukiage<br>Chikusa Ward, Nagoya, Aichi<br>Japan ', 'Phone Number', 'Aug 23, 2014', 0);
addLocation(47.336284,  12.855555, 'Lakeside Furs', 'lakesidefurs.at', 'Zell am See<br>Talstr. 159, 5700 Thumersbach<br>Austria', '+43 (0)6542/73734', 'Aug 8-11 2012', 20);
addLocation(28.333938, -81.587638, 'Megaplex', 'megaplexcon.org', 'Worldgate Resort Hotel<br>3011 Maingate Lane<br>Kissimmee, FL 34747-2302<br>USA', '+1 (866) 705-7676', 'Jul 27-29 2012', 553);
addLocation(34.966572, -89.791608, 'Mephit Furmeet', 'mephitfurmeet.org', 'Whispering Woods Hotel & Conference Center<br>11200 Goodman Rd<br>Olive Branch, MS 38654-4212<br>USA', '+1 (662) 895-2941', 'Aug 30-Sep 1 2013', 548);
addLocation(50.825484,   7.887068, 'Mephit Mini Con', 'mmc.furcon.de', 'Freusburg, Seigen<br>Germany', '', 'May 9-12 2013', 200);
addLocation(35.6568544, 139.7351909, 'Metamore Generation V', 'www.metamor.jp/', 'Village<br>B1F, Fukao Bldg. 1-4-5 Azabu-juban, Minato-ku, Tokyo, Japan', '', 'Oct 5 2013', 0);
addLocation(41.981284, -87.859078, 'Midwest FurFest', 'furfest.org', 'Hyatt Regency O\'Hare<br>9300 Bryn Mawr Avenue<br>Rosemont, Illinois 60018<br>USA', '+1 (847) 696-1234', 'Nov 16-18 2012', 2600);
addLocation(35.7549142,139.7366338, 'Mofukai', 'twipla.jp/events/84157', '北とぴあ 14F　Sky Hall<br>1 Chome-11 Oji Kita Tokyo <br>Japan', '', 'May 5 2014', 0);
addLocation(40.105846, -83.017244, 'Morphicon', 'morphicon.org', 'Holiday Inn Columbus-Worthington<br>7007 N. High Street<br>Worthington, Ohio 43085<br>USA', '+1 (614) 436-0700', 'May 3-6 2012', 275);
addLocation(39.65924 , -75.75286, 'New Year\'s Furry Ball', 'www.ticketderby.com/innerindex.php?eventid=3505', 'Embassy Suites Newark-Wilmington/South<br>854 S College Ave<br>Newark, DE 19713<br>USA', '(302) 368-8000', 'Dec 30-Jan 1 2011', 146) // Was replaced by Furstivus in 2012, but planned to resume for 2013
addLocation(59.166046, 18.13522, 'NordicFuzzCon', 'nordicfuzzcon.org', 'Quality Hotel Winn Haninge<br>Rudsjoterassen 3<br>SE 136 40  Handen<br>Sweden', '', 'Mar 28-31 2013', 175);
addLocation(35.933888, -98.429604, 'Oklacon', 'oklacon.com', 'Roman Nose State Park<br>Rt 1 Box 2-2<br>Watonga, Oklahoma 73772<br>USA', '+1 (580) 623-4215', 'Oct 17-22 2012', 300);
addLocation(-31.952222, 115.858889, 'Perthfur Gathering', 'gathering.perthfurs.net', 'Perth, Western Australia', '', 'Aug 13 2011', 76);//"3rd qtr, 2010"
addLocation(47.444579,-122.293807, 'RainFurrest', 'rainfurrest.org', 'Hilton Seattle Airport<br>17620 International Boulevard<br>Seattle, WA 98188<br>USA', '+1 (206) 244-4800', 'Sep 27-30 2012', 1424);
addLocation(-27.467778, 153.027778, 'RivFur', 'www.rivfur.org', 'Brisbane, Queensland, Australia', '', 'Jun 29-Jul 2 2012', 50);
addLocation(34.6701,  -86.577759, 'Rocket City FurMeet', 'rcfm.net', 'Hilton Garden Inn Huntsville South<br>301 Boulevard South SW<br>Huntsville, Alabama 35802<br>USA', '+1 (256) 881-4170', 'May 24-26 2013', 242);
addLocation(39.762235,-104.900293, 'Rocky Mountain Fur Con', 'rockymountainfurcon.org', 'Doubletree Hotel Denver<br>3203 Quebec Street<br>Denver, Colorado 80207<br>USA', '+1 (303) 321-3333', 'Aug 2-4 2013', 863);
addLocation(56.050627,36.823576, 'Rusfurrence', 'rusfurrence.ru', 'РАН "Авантель Клаб Истра" (RAS "Avantel Club Istra")<br>ЗИстринское Водохранилище (Istra Reservoir), Moscow<br>Russian Federation', '', 'Feb 5-10 2013', 286);
addLocation(57.478307, -4.22672, 'ScotiaCon', 'www.scotiacon.com', 'Mercure Inverness Hotel<br>Church Street<br>Inverness, IV1 1QY<br>Inverness-shire, United Kingdom', '', 'Jul 27-30 2012', 123);
addLocation(-26.201, 28.046, 'South Afrifur meet', 'forum.zafur.co.za/viewtopic.php?f=53&t=1330', '', '', 'Dec 2012?', 0);
addLocation(40.769163,-111.897349, 'Unthrocon', 'www.unthrocon.org', ' Salt Lake City Radisson Hotel<br>215 W South Temple<br>Salt Lake City, Utah 84101<br>USA', '+1 (801) 531-7500', '30 Aug-1 Sep 2013', 0);
addLocation(49.266323,-123.011509, 'VancouFur', 'vancoufur.ca', 'Executive Hotel & Conference Centre Burnaby<br>4201 Lougheed Hwy<br>Burnaby, British Columbia, V5C 3Y6<br>Canada', '', 'Mar 1-3 2013', 479);
addLocation(45.499474, -73.562801, 'What The Fur', 'whatthefur.ca', 'Delta Centre-Ville<br>777 University Street<br>Montreal, Quebec<br>H3C 3Z7, Canada', '+1 (514) 879-1370', 'May 17-19 2013', 282);
addLocation(40.538786, -79.830565, 'Western Pennsylvania Furry Weekend', 'wpafw.org', 'Quality Inn Pittsburgh North<br>2801 Freeport Road<br>Pittsburgh, Pennsylvania 15238<br>USA', '+1 (412) 828-9400', 'Sep 28-30 2012', 116);
addLocation(35.042611, -95.317672, 'Wild Nights', 'wildnights.org', 'Robbers Cave State Park<br>Wilburton, Oklahoma 74578<br>USA', '+1 (918) 465-2565', 'Apr 25-29 2013', 122);
addLocation(50.456309, 30.504819, 'WUFF', 'wuff.org.ua/2013', 'Kiev, Ukraine', '', 'May 9-12 2013', 164)
addLocation(44.520806, 11.401609, 'Zampacon', 'zampacon.forumfree.it', 'Ostello SanSisto<br>via Viadagola 5<br>Bologna, 40127<br>Italy', '', 'Dec 29-Jan 1 2013', 34);
addLocation(47.503095, 12.190969, 'Zillercon', '', 'Wörgl, Tyrol<br>Austria', '', 'Jan 25-Feb 1 2014', 40);
addLocation(50.773040, 15.311701, 'ZodiaCon', 'zodiacon.org', 'Hotel Emilka<br>Na Novině 401<br>468 61 Desná III<br>Czech Republic', '+420 483 300 335', 'May 2012?');

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
opt.innerHTML = "All events ("+count+")";
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
            title: name
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
