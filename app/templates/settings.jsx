var SettingsSlider = React.createClass({
  getInitialState: function() {
    return {setting: this.props.setting};
  },
  handleChange: function(event) {
    this.props.setting.value = event.target.value;
    this.setState({setting: this.props.setting})
  },
  render: function() {
    return (
      <div className="sliderContainer">
        <span className="name">{this.props.setting.name}</span>
        <div className="slider">
          <input className="bar" onChange={this.handleChange} max={this.props.setting.max || 700} type="range" className="rangeinput" defaultValue={this.props.setting.value}/>
          <div className="rangevalue">{this.props.setting.value}</div>
        </div>
      </div>
    );
  }
});

var SettingsBox = React.createClass({
  handleClick: function(ev){

  },
  render: function() {
      var self = this;
      var rows = [];
      
      _.keys(this.props.settings).forEach(function(key) {
        if(typeof(self.props.settings[key].value) == 'boolean'){
          //rows.push(<SettingsSlider setting={self.props.settings[key]} />);
        } else{
          rows.push(<SettingsSlider setting={self.props.settings[key]} />);
        }
      });
      return (
          <div onClick={this.handleClick}>
            <h4>Settings</h4>
            {rows}
          </div>
      );
  }
});

React.render(<SettingsBox settings={SETTINGS} />, document.getElementById('settingsBox'));
