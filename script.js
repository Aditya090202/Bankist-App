'use strict';


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts1 = [account1, account2];

/////////////////////////////////////////////////
// Functions

/////////////////////////////////////////////////
/////////////////////////////////////////////////
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
const displayMovement = (acc) => {
  containerMovements.innerHTML = '';
  //const currency = currentAcc?.currency === 'USD' ? currentAcc.currency = "$" : currentAcc.currency = "€"
  acc.movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `
       <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
       </div>
       `
    // this method inserts html as a string into a webpage using the insertAdjacentHTML method
    // if you want more details, look at the mdn notes online
    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}
//calculates the balance of the current account
const PrintFinalBalance = (account) => {
  const balance = account.movements.reduce((acc, mov) => acc + mov, 0)
  const formattedBalance = formatCur((balance * 100) / 100, account.locale, account.currency)
  labelBalance.innerHTML = `${formattedBalance}`
}

// we want to update the original array by using the forEach method 
const createUsernames = (accounts) => {
  accounts.forEach(acc => {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('')
  })
}
createUsernames(accounts1) // creates the username == initials of the account owner
const updateUI = (acc) => {
  // Display movements
  displayMovement(acc)
  // Display balance
  PrintFinalBalance(acc)
  // Display summary
  calcDisplaySummary(acc)
}
const startLogOutTimer = () => {
  const tick = () => {
    let minutes = String(Math.trunc(time / 60)).padStart(2, '0');
    let seconds = String(time % 60).padStart(2, '0');
    // In each call, print out the remaining time to the UI
    labelTimer.innerHTML = `${minutes}:${seconds}`
    if (time === 0) {
      // log out and stop timer
      clearInterval(timer)
      labelWelcome.innerHTML = `Log in to get started`
      containerApp.style.opacity = 0;
    }
    seconds--;
    time--;
  }
  // set time to 5 minutes
  let time = 300;
  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000)
  return timer;
}
//this method does most of the heavylifting
let currentAcc, timer;
//fake always logged in
// currentAcc = account1
btnLogin.addEventListener('click', e => {
  e.preventDefault(); // prevents refreshing of the page
  createUsernames(accounts1) // creates the username == initials of the account owner
  currentAcc = accounts1.find(acc => acc.username === inputLoginUsername.value)
  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome message
    labelWelcome.innerHTML = `Welcome back, ${currentAcc.owner.split(' ')[0]}!`
    containerApp.style.opacity = "1";
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      year: 'numeric',
      month: 'numeric',
    }
    const locale = navigator.language;
    labelDate.innerHTML = new Intl.DateTimeFormat(locale, options).format(now)
    inputLoginPin.value = "";
    inputLoginUsername.value = ""
    inputLoginPin.blur()
    if (timer) clearInterval(timer);
    timer = startLogOutTimer()
    updateUI(currentAcc)
  }
})
const calcDisplaySummary = (account) => {
  const in_balance = account.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  const formattedBalance = formatCur((in_balance * 100) / 100, account.locale, account.currency)
  labelSumIn.innerHTML = `${formattedBalance}`

  const outgoing_balance = Math.abs(account.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0))
  const formattedBalance2 = formatCur((outgoing_balance * 100) / 100, account.locale, account.currency)
  labelSumOut.innerHTML = `${formattedBalance2}`

  const interest = account.movements.filter(mov => mov > 0)
    .map(deposit => deposit * currentAcc.interestRate / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0)
  const formattedBalance3 = formatCur((interest * 100) / 100, account.locale, account.currency)
  labelSumInterest.innerHTML = `${formattedBalance3}`
}

const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

// transfer money between different accounts
// add an event listener to the arrow button for the transfer field
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  // access the input to determine what account to transfer
  const account_name = accounts1.find(acc => acc.username === inputTransferTo.value)
  //transferMoney(account_name, Number(inputTransferAmount.value))
  if (currentAcc?.currency === "USD" && account_name?.currency === "EUR") {
    transferMoney(account_name, Number(inputTransferAmount.value * 0.93), Number(inputTransferAmount.value))
  }
  else if (currentAcc?.currency === "€" && account_name?.currency === "USD") {
    transferMoney(account_name, Number(inputTransferAmount.value * 1.08), Number(inputTransferAmount.value))
  }
  else {
    transferMoney(account_name, Number(inputTransferAmount.value), Number(inputTransferAmount.value))
  }
  inputTransferTo.value = ''
  inputTransferAmount.value = ''
  // Add transfer date 
  const currentDate = new Date();
  currentAcc.movementsDates.push(currentDate.toISOString())
  account_name.movementsDates.push(currentDate.toISOString())
  displayMovement(currentAcc)
  // Reset timer
  clearInterval(timer)
  timer = startLogOutTimer()

})
const transferMoney = (account, amount, original_amount) => {
  currentAcc.movements.push(0 - original_amount)
  account.movements.push(amount)
}
// User requests a loan 
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  // check if any of deposits are > 10% of the loan 
  const deposits = currentAcc.movements.filter(mov => mov > 0)
  const loanRequested = Math.floor(inputLoanAmount.value)
  if (loanRequested > 0 && currentAcc.movements.some((mov) => loanRequested * 0.1)) {
    // allow the loan
    setTimeout(() => {
      currentAcc.movements.push(loanRequested)
      currentAcc.movementsDates.push(new Date().toISOString())
      updateUI(currentAcc)
    }, 2500)
    inputLoanAmount.value = ''
    inputLoanAmount.blur()
    clearInterval(timer)
    timer = startLogOutTimer()
  }
})

//close an account 
btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  // delete the current account from the accounts array
  const deleteIndex = accounts1.findIndex(acc => acc.pin === Number(inputClosePin.value))
  accounts1.splice(deleteIndex, 1)
  inputClosePin.value = ''
  inputCloseUsername.value = ''
  inputClosePin.blur()
  containerApp.style.opacity = "0";
  labelWelcome.innerHTML = "Log in to get started"
})

// movements.forEach((mov, i) => {

// })
// console.log(createUsernames(user))

// // fake login 
// updateUI(currentAcc)
// containerApp.style.opacity = "1"






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

// create a Date
// const now = new Date();
// const newDate = new Date(2077, 11, 31, 2, 15);
// console.log(newDate)
// console.log(now)
// console.log(new Date(account1.movementsDates[0]))
// console.log(newDate.getFullYear())
// console.log(newDate.getMonth())
// console.log(newDate.getDate())
// console.log(newDate.getDay())
// console.log(newDate.toISOString())
// console.log(newDate.getTime())
// console.log(now.getTime())
// const timestamp = new Date(1686592043117)
// console.log(timestamp)

//setTimeout
const ingredients = ['olives', 'pineapple']
const pizzaTimer = setTimeout((ing1, ing2) => console.log(`Here is your ${ing1} and ${ing2} pizza`), 3000, ...ingredients)
/* js executes this line of code and then waits 3 seconds
but it does "block" other code from executing
I use the example below to demonstrate, when the setTimeout function is called js waits 3 secs
and executes any other code after => basically asynchronous task handling */
if (ingredients.includes('spinach')) clearTimeout(pizzaTimer)
console.log("waiting....")

//setInterval
setInterval(() => {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  //console.log(`${hour}:${minutes}:${seconds}`);
}, 1000)