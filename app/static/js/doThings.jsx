function getUserID() {

  var cookiePairs = document.cookie.split(";");

  for (var i = 0; i < cookiePairs.length; i++) {

    var pairSplit = cookiePairs[i].split("=");
    if (pairSplit[0] === "user_id") {
      return pairSplit[1];
    }

  }

  return null;
}

function sendTask(taskObj, tasksCallback) {

  $.ajax( "api/" + userID + "/newTask", {
    complete: function(response) {
      tasksCallback(response.responseJSON.tasks);
    },
    data: taskObj,
    dataType: "json",
    method: "POST"
  });

}

function getTasks(tasksCallback) {

  $.ajax( "api/" + userID + "/tasks", {
    complete: function(response) {
      tasksCallback(response.responseJSON.tasks);
    },
    dataType: "json",
    method: "GET"
  } );

}

function setDone(taskIndex, boolValue, tasksCallback) {

  $.ajax( "api/" + userID + "/tasks/" + taskIndex + "/doneValue", {
    complete: function(response) {
      tasksCallback(response.responseJSON.tasks);
    },
    data: { done: boolValue },
    dataType: "json",
    method: "PUT"
  });

}

var DoThings = React.createClass({
  tasksCallback: function(tasks) {
    this.setState({ tasks: tasks });
  },
  getInitialState: function() {

    getTasks(this.tasksCallback);

    return {
      nextTaskID: 4,
      tasks: [
        { id: 0, text: 'Discuss report with John', done: false },
        { id: 1, text: 'Get a haircut', done: true },
        { id: 2, text: 'Pay electricity bill', done: true },
        { id: 3, text: 'Check gym hours', done: false }
      ],
      newTaskInput: ''
    }
  },
  render: function() {

    var handleChange = function(event) {
      this.setState({ newTaskInput: event.target.value });
    }.bind(this);

    var submitInput = function() {
      addTask(this.state.newTaskInput);
      this.setState({ newTaskInput: '' });
    }.bind(this);

    var taskSwitcher = function(index1, index2) {
      return function() { 

        var tasks = this.state.tasks.slice();
        var tmp = tasks[index1];
        tasks[index1] = tasks[index2];
        tasks[index2] = tmp;

        this.setState({ tasks: tasks });

      }.bind(this);
    }.bind(this);

    var checkboxToggler = function(index) {
      return function() {

        var tasks = this.state.tasks.slice();
        tasks[index].done = !tasks[index].done;
        setDone(index, tasks[index].done, this.tasksCallback);
        this.setState({ tasks: tasks });

      }.bind(this);
    }.bind(this);

    var addTask = function(text) {

      var tasks = this.state.tasks.slice();
      var newTask = {
        id: this.state.nextTaskID,
        text: text,
        done: false
      };

      tasks.push(newTask);
      sendTask(newTask, this.tasksCallback);

      this.setState({
        nextTaskID: newTask.id + 1,
        tasks: tasks
      });

    }.bind(this);

    return (
      <div>
        <DoThingsForm submitInput={submitInput} handleChange={handleChange} value={this.state.newTaskInput} />
        <List tasks={this.state.tasks} taskSwitcher={taskSwitcher} checkboxToggler={checkboxToggler} />
      </div>
    )
  }
});

var DoThingsForm = React.createClass({
  render: function() {

    return (
      <div>
        <input value={this.props.value} onChange={this.props.handleChange} />
        <button onClick={this.props.submitInput}>A button!</button>
      </div>
    )

  }
});

var List = React.createClass({
  render: function() {

    var listItems = this.props.tasks.map(function(task, index, all) {

      var handleChange = this.props.checkboxToggler(index);

      var switchers = {};

      if (index != all.length)
        switchers.down = this.props.taskSwitcher(index, index + 1);
      if (index != 0)
        switchers.up   = this.props.taskSwitcher(index, index - 1);

      return (
        <ListItem text={task.text} done={task.done} key={task.id} switchers={switchers} handleChange={handleChange} />
      )

    }.bind(this));

    return (
      <ul>
        {listItems}
      </ul>
    )

  }
});

var ListItem = React.createClass({
  render: function() {
    return (
      <li className={this.props.done ? "done" : "undone"}><input type="checkbox" checked={this.props.done} onChange={this.props.handleChange} />{this.props.text}</li>
    )
  }
});

var NoCookieMessage = React.createClass({
  render: function() {
    return (
      <p>Did not find cookie entry. Try clearing cookies and reloading.</p>
    )
  }
});

var userID = getUserID();
if (userID == null)
  React.render(<NoCookieMessage />, document.getElementsByTagName('main')[0]);
else
  React.render(<DoThings />, document.getElementsByTagName('main')[0]);

