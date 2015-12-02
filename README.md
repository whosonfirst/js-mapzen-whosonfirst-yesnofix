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

_See the way we're calling a method named `makeitso` ? Yeah, so stuff like that... stuff like that will change._

### Uh okay... now what?

Did we mention this library is still in active development? Okay. When you run the code above two things will happen. First your data structure will be "pretty-printed" in to a series of nested tables.

Right now it's pretty ugly but the goal is to have something that you can look at without getting a headache. Like this:

![](yesnofix.png)

The second thing that will happen is that each value at the _end_ of each path in your data structure will become active. As of this writing all that happens when you click a value is an alert dialog is triggered displaying the nested path and the value you clicked. Like this:

![](yesnofix-click.png)

The alert dialog is just a placeholder. The eventual goal is to present a friendly and intuitive dialog that allows a person to assert an opinion about a statement (a path and its value). The assertions are simple and spare by design. They are: `yes` this is correct, `no` this is incorrect and `fix` as in "maybe" or "I am not sure".

Which means we might change `fix` to `maybe`. These sorts of questions and decisions, and all the subtleties and nuance they raise, are the work.

Assertions will be recorded locally in the active browser context and made available via a handy `report` method (which has not been written yet). This method will return line-separated text and it will be left to individual users of this library to decide what to do with the information that's been collected.

This approach was pioneered by the New York Public Library and the work they did with [their Building Inspector project](http://buildinginspector.nypl.org/about).

_Actually most of what I just described is working but, like everything else, it is only the barest of functional implementations and not pretty at all. Like this:_

![](yesnofix-report.png)

So, that's the work.

## See also

* http://buildinginspector.nypl.org/
