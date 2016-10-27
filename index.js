var Redis = require('ioredis')
  , uuid = require('node-uuid')


const SEPARATOR = ':'

function noop(){}

function Queue(redis_config) {
  if (!(this instanceof Queue)) {
    return new Queue(redis_config);
  }

  this.redis_config = redis_config
  this.redis_client = new Redis(redis_config)
}



/**
 * Push a job into a given 'todo' queue.
 *
 * 'job' is a POJO that will be pushed into the queue.
 *
 * Relyq expects a job to have an "id" field. If one is present,
 * it is used. If not, we'll assign it a random UUID (v4).
 *
 * Your callback will be called with one optional argument:
 * an error if there is one. If not, it will be called with no arguments.
*/
Queue.prototype.push_todo = function(queue_name, job, cb) {
  if (! job.id) {
    job.id = uuid.v4()
  }

  cb = cb || noop

  var key_queue = queue_name + SEPARATOR + 'todo'
    , key_store = queue_name + SEPARATOR + 'jobs' + SEPARATOR + job.id

  try { var job_str = JSON.stringify(job) }
  catch (ex) { cb("Could not serialize job to JSON!") }

  this.redis_client.multi()
    .lpush(key_queue, job.id)
    .set(key_store, job_str)
    .exec(function(err) { cb(err) })
}



module.exports = Queue

