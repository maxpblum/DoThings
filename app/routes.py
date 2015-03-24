from flask import Flask, render_template, session, make_response, request
 
app = Flask(__name__)    
next_user_id = 0 
 
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

app.secret_key = 'so secret so very very secret'
 
if __name__ == '__main__':
  app.run(debug=True)
