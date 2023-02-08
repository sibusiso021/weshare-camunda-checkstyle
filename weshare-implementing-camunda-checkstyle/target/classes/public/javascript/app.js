const login = async (email) => {

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({'email': email}),
    };
    try {
      const response = await fetch("http://localhost:5050/people", options);

      if (!response.ok) {
        badRequest(response)
        throw new Error(`Error! status: ${response.status}`);
      }

      return person = await response.json();

    } catch (err) {
      console.log(err);
    }
  };


async function personExpenses(person) {


    try {
        const response = await fetch(`http://localhost:5050/expenses/person/${person.id}`, {method : "GET"});
        const result = await response.json();


        let total = calTotal(result)
        const data = {expenses : result,
                userEmail : person.email,
                userName : person.email.split("@")[0],
                grandTotal : total
        }

        const template = document.getElementById('template').innerText;
        const compiledFunction = Handlebars.compile(template);
        document.getElementById('app').innerHTML = compiledFunction(data);
        window.location.hash = "#/expenses";

    } catch (error) {
        console.log(error)

    }

}


async function findPerson(data) {
  try {
    let personTopay = []
    data.forEach(async element => {
      const response =  await fetch(`http://localhost:5050/people/${element.toPersonId}`)
      const result = await response.json()
      personTopay.push(result)
    });
    return personTopay
    
  } catch (error) {
    console.log(error)
  }
  
}

async function findExpense(data) {
  try {
    let expenses = []
    data.forEach(async element => {
      const response =  await fetch(`http://localhost:5050/expenses/${element.expenseId}`)
      const result = await response.json()
      expenses.push(result)
    });
    return expenses
    
  } catch (error) {
    console.log(error)
  }
  
}

async function paymentRequestSent(person) {
  try {
    const response = await fetch(`http://localhost:5050/paymentrequests/sent/${person.id}`, {method : "GET"});
    const result = await response.json();
    const personTopay = await findPerson(result)
    const expenseTopay = await findExpense(result)
    
    console.log(personTopay)


    let total = calTotal(result)
    const data = {
            expenses : result,
            userEmail : person.email,
            userName : person.email.split("@")[0],
            person : personTopay,
            grandTotal : total
    }
    console.log(result);
    const template = document.getElementById('payment-requests-sent-template').innerText;
    const compiledFunction = Handlebars.compile(template);
    document.getElementById('result').innerHTML = compiledFunction(data);

} catch (error) {
    console.log(error)

}
}


function badRequest(response) {
    console.log(response);
    const result = { status : response.status,
                 statusText : response.statusText
        }
    const template = document.getElementById('error-template').innerText;
    const compiledFunction = Handlebars.compile(template);
    document.getElementById('app').innerHTML = compiledFunction(result);
}


function calTotal(data) {
  let total = 0;
  
  data.forEach(element => {
    if (element.nettAmount) {
      total += element.nettAmount;
    } else if ( element.amount) {
      total += element.amount;
    }
   
  });


  return total;
}

window.addEventListener('load', () => {

  const app = $('#app');

  const router = new Router({
    mode:'hash',
    root:'index.html',
    page404: (path) => {
      window.location.href = "http://localhost:5050";
    }
  });

  router.add('/expenses',() =>{
    personExpenses(this.person)
  });


  router.add('/paymentrequests_sent', ()=> {
    paymentRequestSent(this.person)
  })


  router.addUriListener();

  $('a').on('click', (event) => {
    event.preventDefault();
    const target = $(event.target);
    const href = target.attr('href');
    const path = href.substring(href.lastIndexOf('/'));
    router.navigateTo(path);
  });

  $('form').on('submit', async (event) => {
    event.preventDefault();
    const email = new FormData(event.target).get("email");
    this.person = await login(email)
    const path = "#/expenses";
    router.navigateTo(path);
  });

  router.navigateTo('/');
});
