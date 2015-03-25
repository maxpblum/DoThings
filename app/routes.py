from flask import Flask, render_template, make_response, request, jsonify
from data import TaskData
 
app = Flask(__name__)    
next_user_id = 0 
data = TaskData()
 
@app.route('/')
def home():

  global next_user_id

  resp = make_response(render_template('index.html'))
  user_id = request.cookies.get('user_id')

  if user_id is None:

    print "New user, id: {0}".format(next_user_id)
    resp.set_cookie('user_id', "{0}".format(next_user_id))
    next_user_id += 1

  else:

    print "Existing user, id: {0}".format(user_id)

  return resp

@app.route('/api/<id>/tasks', methods=['GET'])
def get_tasks(id):
  if id == request.cookies.get('user_id'):
    return jsonify({ 'tasks': data.get_data(id) })
  return "hi"

@app.route('/api/<id>/newTask', methods=['POST'])
def new_task(id):
  if id == request.cookies.get('user_id'):
    task_id = request.form.get('id')
    task_text = request.form.get('text')
    if task_id is not None and task_text is not None:
      data.add_task(id, { 'id': task_id, 'text': task_text, 'done': False })
    return jsonify({ 'tasks': data.get_data(id) })

@app.route('/api/<id>/tasks/<index>/doneValue', methods=['PUT'])
def done_value(id, index):
  if id == request.cookies.get('user_id'):
    done_value = True if request.form.get('done') == "true" else False
    data.set_done(id, int(index), done_value)
    return jsonify({ 'tasks': data.get_data(id) })

@app.route('/api/<id>/tasks/swap', methods=['PUT'])
def swap_two(id):
  if id == request.cookies.get('user_id'):
    index1, index2 = request.form.get('indices')
    data.swap_two(id, index1, index2)
    return jsonify({ 'tasks': data.get_data(id) })

app.secret_key = 'so secret so very very secret'
 
if __name__ == '__main__':
  app.run(debug=True)
