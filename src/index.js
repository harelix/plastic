import Form from "./components/Form";
import routes from './routes';

export default Form;
render(
    <Router history={browserHistory} routes={routes} />,
    document.getElementById('app')
);

if (!String.prototype.format) {
    String.prototype.format = function() {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
          ? args[number]
          : match
        ;
      });
    };
  }