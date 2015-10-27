var mapzen = mapzen || {};
mapzen.whosonfirst = mapzen.whosonfirst || {};

mapzen.whosonfirst.yesnofix = (function(){

		var self = {

			// please do not call this 'engage'...

			'engage': function(props){

				var pretty = document.createElement("div");
				pretty.setAttribute("id", "props-pretty");
			
				buckets = self.bucket_props(props);

				// these two go first

				wof_bucket = self.render_bucket('wof', buckets['wof'])
				pretty.appendChild(wof_bucket);
				delete buckets['wof']

				if (buckets['name']){
					name_bucket = self.render_bucket('name', buckets['name']);
					pretty.appendChild(name_bucket);
					delete buckets['name'];
				}

				// now render the rest of them

				var namespaces = Object.keys(buckets);
				namespaces = namespaces.sort();

				var count_ns = namespaces.length;

				for (var i=0; i < count_ns; i++){
					var ns = namespaces[i];
					var dom = self.render_bucket(ns, buckets[ns]);
					pretty.appendChild(dom);
				}
				
				return pretty;				
			},

			'render': function(d, ctx){
				
				// console.log("render context is " + ctx);
				
				if (Array.isArray(d)){
					return self.render_list(d, ctx);
				}
				
				else if (typeof(d) == "object"){
					return self.render_dict(d, ctx);
				}
				
				else {
					
					var possible_wof = [
							    'wof-belongsto',
							    'wof-parent_id', 'wof-children',
							    'wof-breaches',
							    'wof-supersedes',
							    'wof-superseded_by',
							    // TO DO : please to write js-whosonfirst-placetypes...
							    'wof-hierarchy-continent_id', 'wof-hierarchy-country_id', 'wof-hierarchy-region_id',
							    'wof-hierarchy-county_id', 'wof-hierarchy-locality_id', 'wof-hierarchy-neighbourhood_id',
							    'wof-hierarchy-campus_id', 'wof-hierarchy-venue_id'
							    ];
					
					if ((ctx) && (d)){
						
						if ((possible_wof.indexOf(ctx) != -1) && (d > 0)){
							
							var root = mapzen.whosonfirst.spelunker.abs_root_url();
							var link = root + "id/" + encodeURIComponent(d) + "/";
							var el = self.render_link(link, d, ctx);

							var text = el.children[0];
							text.setAttribute("data-value", mapzen.whosonfirst.php.htmlspecialchars(d));
							text.setAttribute("class", "props-uoc props-uoc-name props-uoc-name_" + mapzen.whosonfirst.php.htmlspecialchars(d));

							return el;
						}

						else if (ctx == 'wof-id'){
							return self.render_code(d, ctx);
						}

						else if (ctx == 'wof-placetype'){
							var root = mapzen.whosonfirst.spelunker.abs_root_url();
							var link = root + "placetypes/" + encodeURIComponent(d) + "/";
							return self.render_link(link, d, ctx);
						}

						else if (ctx == 'wof-concordances-gn:id'){
							var link = "http://geonames.org/" + encodeURIComponent(d) + "/";
							return self.render_link(link, d, ctx);							
						}

						/*
						else if (ctx == 'wof-concordances-mzb:id'){
							var link = "https://s3.amazonaws.com/osm-polygons.mapzen.com/" + encodeURIComponent(d) + ".tgz";
							return self.render_link(link, d, ctx);							
						}
						*/

						else if ((ctx == 'wof-concordances-gp:id') || (ctx == 'wof-concordances-woe:id')){
							var link = "https://woe.spum.org/id/" + encodeURIComponent(d) + "/";
							return self.render_link(link, d, ctx);							
						}

						else if (ctx == 'wof-concordances-tgn:id'){
							var link = "http://vocab.getty.edu/tgn/" + encodeURIComponent(d);
							return self.render_link(link, d, ctx);
						}

						else if (ctx == 'wof-lastmodified'){
							var dt = new Date(parseInt(d) * 1000);
							return self.render_text(dt.toISOString(), ctx);
						}
						
						else if ((ctx == 'wof-megacity') && (d == 1)){
							var root = mapzen.whosonfirst.spelunker.abs_root_url();
							var link = root + "megacities/";
							return self.render_link(link, "HOW BIG WOW MEGA SO CITY", ctx);
						}

						else if (ctx == 'wof-tags'){
							var root = mapzen.whosonfirst.spelunker.abs_root_url();
							var link = root + "tags/" + encodeURIComponent(d) + "/";
							return self.render_link(link, d, ctx);
						}

						else if ((ctx.match(/^name-/)) || (ctx == 'wof-name')){
							var root = mapzen.whosonfirst.spelunker.abs_root_url();
							var link = root + "search/?q=" + encodeURIComponent(d);
							return self.render_link(link, d, ctx);
						}

						else if (ctx == 'sg-city'){
							var root = mapzen.whosonfirst.spelunker.abs_root_url();
							var link = root + "search/?q=" + encodeURIComponent(d) + "&placetype=locality";
							return self.render_link(link, d, ctx);
						}

						else if (ctx == 'sg-postcode'){
							var root = mapzen.whosonfirst.spelunker.abs_root_url();
							var link = root + "postalcodes/" + encodeURIComponent(d) + "/";
							return self.render_link(link, d, ctx);
						}

						else if (ctx == 'sg-tags'){
							var root = mapzen.whosonfirst.spelunker.abs_root_url();
							var link = root + "tags/" + encodeURIComponent(d) + "/";
							return self.render_link(link, d, ctx);
						}
						
						else if (ctx.match(/^sg-classifiers-/)){
							var root = mapzen.whosonfirst.spelunker.abs_root_url();
							var link = root + "categories/" + encodeURIComponent(d) + "/";
							return self.render_link(link, d, ctx);
						}

						else {
							return self.render_text(d, ctx);
						}
					  }

					  else {
						return self.render_text(d, ctx);
					}
				}
				},

			'render_dict': function(d, ctx){

				var table = document.createElement("table");
				table.setAttribute("class", "table");

				for (k in d){
					var row = document.createElement("tr");
				
					// console.log("render context is " + ctx);

					var label_text = k;

					if (ctx == 'wof-concordances'){

						if (k == 'gn:id'){
							label_text = 'geonames';
						}

						else if ((k == 'gp:id') || (k == 'woe:id')){
							label_text = 'geoplanet';
						}

						else if (k == 'fct:id'){
							label_text = 'factual';
						}

						else if (k == 'tgn:id'){
							label_text = 'tgn (getty)';
						}

						else if (k == 'oa:id'){
							label_text = 'our airports';
						}

						else if (k == 'sg:id'){
							label_text = 'simplegeo';
						}

						else {}

					}

					var header = document.createElement("th");
					var label = document.createTextNode(mapzen.whosonfirst.php.htmlspecialchars(label_text));
					header.appendChild(label);

					var _ctx = (ctx) ? ctx + "-" + k : k;

					var content = document.createElement("td");
					var body = self.render(d[k], _ctx);

					content.appendChild(body);

					row.appendChild(header);
					row.appendChild(content);

					table.appendChild(row);
				}

				return table;
			},

			'render_list': function(d, ctx){

				var count = d.length;

				if (count == 0){
					return self.render_text("–", ctx);
				}

				if (count <= 1){
					return render(d[0], ctx);
				}

				var list = document.createElement("ul");
				
				for (var i=0; i < count; i++){
					
					var item = document.createElement("li");
					var body = self.render(d[i], ctx);

					item.appendChild(body);
					list.appendChild(item);
				}

				return list;
			},

				'render_editable': function(d){
				// please write me
			},

				'render_text': function(d, ctx){

				var text = mapzen.whosonfirst.php.htmlspecialchars(d);

				var span = document.createElement("span");
				span.setAttribute("id", ctx);
				span.setAttribute("class", "props-uoc");

				var el = document.createTextNode(text);
				span.appendChild(el);
				return span;
			},

			'render_link': function(link, text, ctx){

				var anchor = document.createElement("a");
				anchor.setAttribute("href", link);
				anchor.setAttribute("target", "_wof");
				var body = self.render_text(text, ctx);
				anchor.appendChild(body);
				return anchor;
			}

			'render_code': function(text, ctx){

				var code = document.createElement("code");
				var body = self.render_text(text, ctx);
				code.appendChild(body);
				return code;
			},

				'bucket_props': function(props){

				buckets = {};

				for (k in props){
					parts = k.split(":", 2);

					ns = parts[0];
					pred = parts[1];

					if (parts.length != 2){
						ns = "misc";
						pred = k;
					}

					if (! buckets[ns]){
						buckets[ns] = {};					
					}
					
					buckets[ns][pred] = props[k];
				}
				
				return buckets;
			},

				'sort_bucket': function(bucket){

				var sorted = {};

				var keys = Object.keys(bucket);
				keys = keys.sort();

				var count_keys = keys.length;

				for (var j=0; j < count_keys; j++){
					var k = keys[j];
					sorted[k] = bucket[k];
				}

				return sorted;
			},

				'render_bucket': function(ns, bucket){

				var wrapper = document.createElement("div");

				var header = document.createElement("h3");
				var content = document.createTextNode(ns);
				header.appendChild(content);
			
				var sorted = sort_bucket(bucket);
				var body = render(sorted, ns);
				
				wrapper.appendChild(header);
				wrapper.appendChild(body);

				return wrapper;
				},

			}

		return self;

})();