# relyq-pusher

A node library to make pushing into `relyq`-style queues as easy as humanly possible


## Usage

```javascript
var Queue = require('relyq-pusher')
var q = Queue(/* optionally, pass a redis config */)

q.push_todo('queue_name', {job:"Data", foo:"Bar"}, function(err) {
  if (err) console.error("ZOMG", err)
})
```
