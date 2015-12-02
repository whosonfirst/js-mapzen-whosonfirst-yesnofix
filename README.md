# js-whosonfirst-yesnofix

A little bit of Javascript love to make arbitrary data structures yes-no-fix-able.

## Caveat

This library is still in active development. It may change. It may not work. It definitely isn't properly documented yet.

## Example

```
    <div id="yesnofix"></div>

    <script type="text/javascript">

      var data = {
	"query": {"filtered": {"filter": {
		"and": [
		       {"term": {"category": "performance"}},
		       {"term": {"region_id": 85688543}}
		       ]},
      		"query": {"query_string": {"query": "gowanus"}}}},
	"sort": [
		{"wof:megacity": {"mode": "max", "order": "desc"}},
		{"gn:population": {"mode": "max", "order": "desc"}},
		{"wof:name": {"order": "desc"}},
		{"wof:scale": {"mode": "max", "order": "desc"}},
		{"geom:area": {"mode": "max", "order": "desc"}}],
      };

      var target = "yesnofix";

      if (! mapzen.whosonfirst.yesnofix.makeitso(data, target)){
      	alert("failed to render data");
      }

    </script>
```

## See also

* http://buildinginspector.nypl.org/about
