'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  currency:'EUR',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  currency: 'USD'
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  currency:'EUR'
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  currency:'USD'
};
// array of all the accounts
const accounts = [account1, account2, account3, account4];
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


// this method displays the movements of current account logged in to the screen 
const displayMovement = (movements) => {
  containerMovements.innerHTML = '';
  const currency = currentAcc.currency === 'USD' ? currentAcc.currency = "$": currentAcc.currency = "€"
  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
       <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${Math.abs(mov)}${currency}</div>
       </div>
       `
    // this method inserts html as a string into a webpage using the insertAdjacentHTML method
    // if you want more details, look at the mdn notes online
    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}
//calculates the balance of the current account
const PrintFinalBalance = (mov) => {
  const balance = mov.reduce( (acc, mov) => acc + mov, 0)
  labelBalance.innerHTML = `${balance}${currentAcc.currency}`
}

// we want to update the original array by using the forEach method 
const createUsernames = (accounts) => {
  accounts.forEach(acc => {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('')
  })
}
createUsernames(accounts)
//this method does most of the heavylifting
let currentAcc;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAcc = accounts.find(acc => acc.username === inputLoginUsername.value)
  if(currentAcc?.pin === Number(inputLoginPin.value)){
    //Display UI and welcome message
    labelWelcome.innerHTML = `Welcome back, ${currentAcc.owner.split(' ')[0]}!`
    containerApp.style.opacity = "1";
    inputLoginPin.value = "";
    inputLoginUsername.value = ""
    inputLoginPin.blur()

    // Display movements
    displayMovement(currentAcc.movements)
    // Display balance
    PrintFinalBalance(currentAcc.movements)
    // Display summary
    calcDisplaySummary(currentAcc.movements)


  }
})
const calcDisplaySummary = (movements) => {
  const in_balance = movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.innerHTML = `${in_balance}${currentAcc.currency}`

  const outgoing_balance = Math.abs(movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0))
  labelSumOut.innerHTML = `${outgoing_balance}${currentAcc.currency}`

  const interest = movements.filter(mov => mov > 0)
  .map(deposit => deposit * currentAcc.interestRate / 100)
  .filter((int, i, arr) => {
    return int >= 1;
  })
  .reduce((acc, int) => acc + int, 0)
  labelSumInterest.innerHTML = `${interest}${currentAcc.currency}`
}
// transfer money between different accounts
// add an event listener to the arrow button for the transfer field
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  // access the input to determine what account to transfer
  const account_name = accounts.find(acc => acc.username === inputTransferTo.value) 
  if(currentAcc?.currency === "$" && account_name?.currency === "EUR"){
    transferMoney(account_name, Number(inputTransferAmount.value * 0.93))
  }
  else if(currentAcc?.currency === "€" && account_name?.currency === "USD"){
    transferMoney(account_name, Number(inputTransferAmount.value * 1.08))
  }
  else{
    transferMoney(account_name, Number(inputTransferAmount.value))
  }
  inputTransferTo.value = ''
  inputTransferAmount.value = '' 
})
const transferMoney = (account, amount) => {
   currentAcc.movements.push(0 - amount)
   // Display movements
   displayMovement(currentAcc.movements)
   // Display balance
   PrintFinalBalance(currentAcc.movements)
   // Display summary
   calcDisplaySummary(currentAcc.movements)
   account.movements.push(amount)

}
//close an account 
btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  // delete the current account from the accounts array
  const deleteIndex = accounts.findIndex(acc => acc.pin === Number(inputClosePin.value))
  accounts.splice(deleteIndex, 1)
  inputClosePin.value = ''
  inputCloseUsername.value = ''
  inputClosePin.blur()
  containerApp.style.opacity = "0";
  labelWelcome.innerHTML = "Log in to get started"
})

// movements.forEach((mov, i) => {

// })
// console.log(createUsernames(user))










/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES




/////////////////////////////////////////////////


// Slice + splice and reverse methods on arrays
// const arr1 = ['a', 'b', 'c', 'd']
// console.log(arr1.slice(-1));
// console.log(arr1)
// /* the slice array method does not mutate the original array, but creates a "shallow" copy 
//  and applies the slice method to it. */

// // splice method
// const arr2 = [...arr1, 'e', 'f', 'g'];
// arr2.splice(1, 2); // this will grab two elements after the first index(including index 1)
// console.log(arr2);
// // plus this method changes the original array object and doesn't make a copy

// // reverse method
// const arr3 = [12, 35, 90, 78, 61, 43];
// console.log(arr3.reverse()) // it "reverses" the elements in the array
// console.log(arr3)
// // this method also changes the original array

// //concat method
// // it 'adds' two arrays together => basically appending one array to another
// const letters = arr1.concat(arr2)
// console.log(letters)

// //join method
// console.log(letters.join('-'));
// // combines all the elements in the array using a specific string

// console.log(arr3.at(-1))


//Looping arrays using forEach method
//continue and break statements don't work in a forEach loop
// // forEach with Maps and Sets
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
// currencies.forEach((val, key, map) => {
//   console.log(`${key}: ${val}`)
// })
// //Sets
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR', 'GBP'])
// console.log(currenciesUnique)
// currenciesUnique.forEach((val, _, set) => {
//   console.log(`${_}: ${val}`);
// })
/* in a set, the key and value parameter are the same
 because a set doesn't have keys */
// Test data 1
// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3]

// //Test Data 2 
// const dogsJulia2 = [9, 16, 6, 8, 3];
// const dogsKate2 = [10, 5, 6, 1, 4];
//  //Coding challenge #1
//  const checkDogs = (dogsJulia, dogsKate) => {
//   // create a shallow copy of julia array => remove 1st and last 2 dogs
//   const copyOfdogsJulia = dogsJulia.slice(1, -2)
//   const JuliaAndKateData = copyOfdogsJulia.concat(dogsKate);
//   JuliaAndKateData.forEach((dog, i) => {
//     if(dog >= 3){
//       console.log(`Dog number ${i + 1} is an adult and is ${dog} years old`)
//     }
//     else{
//       console.log(`Dog number ${i + 1} is still a puppy`);
//     }
//   })
// }
// checkDogs(dogsJulia, dogsKate);
// checkDogs(dogsJulia2, dogsKate2);
// test data 1 
// const exampleArr = [5, 2, 4, 1, 15, 8, 3];
// const exampleArr2 = [16, 6, 10, 5, 6, 1, 4];
// const calcAverageHumanAge = (ages) => {
//   const humanAges = ages.map(dogAge => {
//     if(dogAge <= 2){
//       return dogAge * 2 
//     }
//     else{
//       return 16 + dogAge * 4
//     }
//   })
//   const filter = humanAges.filter(age => age >= 18)
//   const avgHumanAge = filter.reduce((acc, age) => 
//     acc + age, 0) / filter.length;
//   console.log(humanAges)
//   console.log(filter)
//   return avgHumanAge
// }
// const avg1 = calcAverageHumanAge(exampleArr)
// const avg2 = calcAverageHumanAge(exampleArr2)
// console.log(avg1, avg2)

// const euroToUsd = 1.1;
// const movementsUsd = movements.map(mov => mov * euroToUsd)
// console.log(movementsUsd)
// console.log(movements)
// const movementsUsdfor = []
// for(const mov of movements){
//    movementsUsdfor.push(mov * 1.1)
// }
// console.log(movementsUsdfor)


// // reduce method
// // the callback function has different parameters: acc "accumulates the value"
// const number = movements.reduce((acc, cur) => 
//   acc + cur,  0)
// console.log(number)