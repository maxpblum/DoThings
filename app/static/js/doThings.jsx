var DoThings = React.createClass({
  getInitialState: function() {
    return {
      nextTaskID: 4,
      tasks: [
        { id: 0, text: 'Discuss report with John', done: false },
        { id: 1, text: 'Get a haircut', done: true },
        { id: 2, text: 'Pay electricity bill', done: true },
        { id: 3, text: 'Check gym hours', done: false }
      ]
    }
  },
  render: function() {

    var taskSwitcher = function(index1, index2) {
      return function() { 

        var tasks = this.state.tasks.slice();
        var tmp = tasks[index1];
        tasks[index1] = tasks[index2];
        tasks[index2] = tmp;

        this.setState({ tasks: tasks });

      }.bind(this);
    }.bind(this);

    var doneMarker = function(index) {
      return function() {

        var tasks = this.state.tasks.slice();
        tasks[index].done = !tasks[index].done;
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

      this.setState({
        nextTaskID: newTask + 1,
        tasks: tasks
      });

    }.bind(this);

    return (
      <div>
        <DoThingsForm addTask={addTask} value=""/>
        <List tasks={this.state.tasks} taskSwitcher={taskSwitcher} doneMarker={doneMarker} />
      </div>
    )
  }
});

var DoThingsForm = React.createClass({
  render: function() {

    var currentText = this.props.value;

    var handleChange = function(event) {
      currentText = event.target.value;
    }

    var submitter = function() {
      this.props.addTask(currentText);
    }.bind(this);

    return (
      <div>
        <input defaultValue={this.props.value} onChange={handleChange} />
        <button onClick = {submitter}>A button!</button>
      </div>
    )
  }
});

var List = React.createClass({
  render: function() {

    var listItems = this.props.tasks.map(function(task, index, all) {

      var handleChange = this.props.doneMarker(index);

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
      <li className={this.props.done ? "done" : "undone"}><input type="checkbox" defaultChecked={this.props.done} onClick={this.props.handleChange} />{this.props.text}</li>
    )
  }
});

React.render(<DoThings />, document.getElementsByTagName('main')[0]);
