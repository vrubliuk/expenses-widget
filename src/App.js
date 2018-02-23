import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    widgetName: 'Expenses',
    widgetCollapsed: false,
    toggleButtonDirection: 'up',
    sortNameButton: false,
    sortAmountButton: false,
    sorted: false,
    tableData: [
      {name:'Dinner', amount:23.50},
      {name:'Lunch', amount:17.99},
      {name:"Space Hulk", amount:12.99}
    ],
    newTableDataName: '',
    newTableDataAmount: '',
    totalAmount: 0,
    errorMessage: ''
  };

  handleWidgetNameInput = (e) => {
    this.setState({ widgetName: e.target.value });
  }

  handleToggleButton = () => {
    const widgetCollapsed = this.state.widgetCollapsed;
    if (!widgetCollapsed) {
      this.setState({
        widgetCollapsed: true,
        toggleButtonDirection: 'down'
      });
    } else {
      this.setState({
        widgetCollapsed: false,
        toggleButtonDirection: 'up'
      });
    }
  }

  sortTableData = (fieldDirection) => {
    let tableData = this.state.tableData;
    if (fieldDirection === 'name a-z') {
      let sorted = 'name a-z';
      let sortNameButton = 'up';
      let sortAmountButton = false;
      tableData.sort((a, b) => {
        let x = a.name.toLowerCase();
        let y = b.name.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        if (x === y) {
          let z = a.amount;
          let q = b.amount;
          return z - q;
        }
        return 0;
    });
      this.setState({
        sorted: sorted,
        sortNameButton: sortNameButton,
        sortAmountButton: sortAmountButton,
        tableData: tableData
      });
    } else if (fieldDirection === 'name z-a') {
      let sorted = 'name z-a';
      let sortNameButton = 'down';
      let sortAmountButton = false;
      tableData.sort((a, b) => {
        let x = a.name.toLowerCase();
        let y = b.name.toLowerCase();
        if (x < y) {return 1;}
        if (x > y) {return -1;}
        if (x === y) {
          let z = a.amount;
          let q = b.amount;
          return q - z;
        }
        return 0;
    });
      this.setState({
        sorted: sorted,
        sortNameButton: sortNameButton,
        sortAmountButton: sortAmountButton,
        tableData: tableData
      });
    }  else if (fieldDirection === 'amount 1-9') {
      let sorted = 'amount 1-9';
      let sortNameButton = false;
      let sortAmountButton = 'up';
      tableData.sort((a, b) => {
        let x = b.amount;
        let y = a.amount;
        if (x === y) {
          let z = a.name.toLowerCase();
          let q = b.name.toLowerCase();
          if (q > z) {return -1;}
          if (z > q) {return 1;}
        }
        return y - x;
        });
      this.setState({
        sorted: sorted,
        sortNameButton: sortNameButton,
        sortAmountButton: sortAmountButton,
        tableData: tableData
      });
    } else if (fieldDirection === 'amount 9-1') {
      let sorted = 'amount 9-1';
      let sortNameButton = false;
      let sortAmountButton = 'down';
      tableData.sort((a, b) => {
        let x = b.amount;
        let y = a.amount;
        if (x === y) {
          let z = a.name.toLowerCase();
          let q = b.name.toLowerCase();
          if (z > q) {return -1;}
          if (q > z) {return 1;}
        }
        return x - y;
        });
      this.setState({
        sorted: sorted,
        sortNameButton: sortNameButton,
        sortAmountButton: sortAmountButton,
        tableData: tableData
      });
    } else {
      return;
    }
  }

  handleClickSortByName = () => {
    let sorted = this.state.sorted;
    if (sorted === 'name a-z') {
      this.sortTableData('name z-a');
    } else {
      this.sortTableData('name a-z');
    }
  }

  handleClickSortByAmount = () => {
    let sorted = this.state.sorted;
    if (sorted === 'amount 1-9') {
      this.sortTableData('amount 9-1');
    } else {
      this.sortTableData('amount 1-9');
    }
  }

  updateTotalAmount = () => {
    let _this = this;
    return new Promise((resolve) => {
    const tableData = [..._this.state.tableData];
    const totalAmount = tableData.reduce((sum, current) => {
      return sum + current.amount;
    }, 0);
    _this.setState({
      totalAmount: totalAmount
    });
    resolve();
  });
  }

  handleNewName = (e) => {
      const regex = /^[A-Za-zА-Яа-яЁёІіЇїЄє0-9 ]*$/;
      if ( regex.test(e.target.value)) {
        this.setState({ newTableDataName: e.target.value})
      }
  }

  handleNewAmount = (e) => {
    const regex = /^(\d*)\.{0,1}(\d){0,2}$/;
    if ( regex.test(e.target.value)) {
        this.setState({ newTableDataAmount: e.target.value})
    }
  }

  showError = (errorMessage) => {
    this.setState({
      errorMessage: errorMessage
    });
    setTimeout(() => {
      this.setState({
        errorMessage: ''
      });
    }, 1000)
  }
  
  updateTableData = (resolve) => {
    const newTableDataName = this.state.newTableDataName;
    const newTableDataAmount = Number(this.state.newTableDataAmount);
    const tableData = [...this.state.tableData];
    if (newTableDataName && newTableDataAmount) {
      let newRow = {name:newTableDataName, amount:newTableDataAmount};
      tableData.push(newRow);
      this.setState({
        tableData: tableData,
        newTableDataName: '',
        newTableDataAmount: ''
      });
      resolve();
    }
  }

  handleAddButton = () => {
    this.validateInputsAreFilled();
    let sorted = this.state.sorted;
    new Promise(this.updateTableData)
    .then(this.updateTotalAmount)
    .then(this.sortTableData.bind(null, sorted));
  }

  handleEnterKey = (e) => {
    if (e.keyCode === 13) {
      this.validateInputsAreFilled();
      let sorted = this.state.sorted;
      new Promise(this.updateTableData)
      .then(this.updateTotalAmount)
      .then(this.sortTableData.bind(null, sorted));
    }
  }

  validateInputsAreFilled = () => {
    const newTableDataName = this.state.newTableDataName;
    const newTableDataAmount = this.state.newTableDataAmount;
    if (!newTableDataName && newTableDataAmount) {
      this.showError("Please fill out the name as well!");
    } else if (newTableDataName && !newTableDataAmount) {
      this.showError("Please fill out the amount as well!");
    } else if (!newTableDataName && !newTableDataAmount) {
      this.showError("Please fill out the name and amount!");
    }
  }

  componentWillMount() {
    this.updateTotalAmount();
  }

  render() {
    return (
      <div className="App">
        <div className='titleBar'>
          <input onChange={this.handleWidgetNameInput}  type='text' value={this.state.widgetName} />
          <button onClick={this.handleToggleButton}><i className="material-icons">{`keyboard_arrow_${this.state.toggleButtonDirection}`}</i></button>
        </div>
        <div className='mainBar' style={ this.state.widgetCollapsed ? {display: 'none'} : {display: 'block'} }>
          <div className='mainBar__tableHead'>
            <div onClick={this.handleClickSortByName} className='mainBar__tableHead__name'>
              <span>Name</span>
              {
                this.state.sortNameButton ? 
                <button><i className="material-icons mainBar__sortNameButton">{`arrow_drop_${this.state.sortNameButton}`}</i></button>
                : null
              }
            </div>
            <div onClick={this.handleClickSortByAmount} className='mainBar__tableHead__amount'>
            <span>Amount</span>
              {
                this.state.sortAmountButton ?
                <button><i className="material-icons mainBar__sortAmountButton">{`arrow_drop_${this.state.sortAmountButton}`}</i></button>
                : null
              }
            </div>
          </div>
          <div className='mainBar__tableData'>
              {this.state.tableData.map((row) => {
                  return <div><div>{row.name}</div><div>{'$ ' + row.amount.toFixed(2)}</div></div>;
              })}
          </div>
          <div className='mainBar__inputBar'>
            <div>
              <input onChange={this.handleNewName} onKeyUp={this.handleEnterKey} type='text' value={this.state.newTableDataName} maxLength={15}/>
            </div>
            <div>
              <div>
                <span>$</span>
                <input onChange={this.handleNewAmount} onKeyUp={this.handleEnterKey} type='text' value={this.state.newTableDataAmount} maxLength={10}/>
              </div>
               <button onClick={this.handleAddButton}><i className="material-icons">add</i></button>
          </div>
          </div>
          {
            this.state.errorMessage ?
            <div className='mainBar__error'>{this.state.errorMessage}</div>
            : 
            <div className='mainBar__totalBar'>
              <div>
              Total
              </div>
              <div>
              {'$ ' + this.state.totalAmount.toFixed(2)}
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default App;