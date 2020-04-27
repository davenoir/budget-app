$(document).ready(function () {

    var budgetFeedback, expenseFeedback, budgetForm, budgetInput, budgetAmount, expenseAmount,
        balance, balanceAmount, expenseForm, expenseInput, amountInput, expenseList, itemList, itemId;

    budgetFeedback = $('.budget-feedback');
    expenseFeedback = $('.expense-feedback');
    budgetForm = $('#budget-form');
    budgetInput = $('#budget-input');
    budgetAmount = $('#budget-amount');
    expenseAmount = $('#expense-amount');
    balance = $('#balance');
    balanceAmount = $('#balance-amount');
    expenseForm = $('#expense-form');
    expenseInput = $('#expense-input');
    amountInput = $('#amount-input');
    expenseList = $('#expense-list');
    itemList = [];
    itemId = 0;

    // method for submitting the value to the balance indicator and print an error message
    function budgetFromSubmit() {
        let budgetValue = budgetInput.val();
        if (budgetValue === '' || budgetValue <= 0) {

            setTimeout(function () {
                budgetFeedback.slideToggle('slow', function () {
                    budgetFeedback.addClass('showItem');
                    budgetFeedback.html(`<p> value cannot be empty or negative</p>`);
                });
            }, 500)

            setTimeout(function () {
                budgetFeedback.slideToggle('slow', function () {
                    budgetFeedback.removeClass('showItem');
                });
            }, 3000)
        } else {
            budgetAmount.text(budgetValue);
            budgetInput.val('');
            printTheBalance();
        }
    };

    // calculate balance and change color according to the condition
    function printTheBalance() {
        let expenses = sumExpense();
        let total = parseInt(budgetAmount.text()) - expenses;
        balanceAmount.text(total);
        if (total < 0) {
            balance.removeClass('showGreen', 'showBlack');
            balance.addClass('showRed');
        } else if (total > 0) {
            balance.removeClass('showRed', 'showBlack');
            balance.addClass('showGreen');
        } else if (total === 0) {
            balance.removeClass('showRed', 'showGreen');
            balance.addClass('showBlack');
        }
    };

    // method for validation of expenses, creating an object in order to use the corresponding ID of the element
    // send the contents as an object to the list
    function expenseFormSubmit() {
        let expenseValue = expenseInput.val();
        let amountValue = amountInput.val();

        if (expenseValue === '' || amountValue === '' || amountValue < 0) {

            setTimeout(function () {
                expenseFeedback.slideToggle('slow', function () {
                    expenseFeedback.addClass('showItem');
                    expenseFeedback.html('<p> value cannot be empty or negative</p>');
                });
            }, 500)

            setTimeout(function () {
                expenseFeedback.slideToggle('slow', function () {
                    expenseFeedback.removeClass('showItem');
                });
            }, 3000)
        }
        else {
            let amount = parseInt(amountValue);
            expenseInput.val('');
            amountInput.val('');

            let expenseObject = {
                id: itemId,
                title: expenseValue,
                amount: amount,
            }

            itemId++;
            itemList.push(expenseObject);
            addExpenseToList(expenseObject);
            printTheBalance();
        }
    };

    // adding elements to expense list
    function addExpenseToList(expenseObject) {
        let parentDiv = $('<div>');
        parentDiv.addClass('expense');
        parentDiv.html(`<div class="expense-item d-flex justify-content-between align-items-baseline">
        <h6 class="expense-title mb-0 text-uppercase list-item">${expenseObject.title}</h6>
        <h5 class="expense-amount mb-0 list-item">${expenseObject.amount}</h5>
        <div class="expense-icons list-item">
        <a href="" class="edit-icon mx-2" data-id="${expenseObject.id}">
        <i class="fas fa-edit"></i>
        </a>
        <a href="" class="delete-icon mx-2" data-id="${expenseObject.id}">
        <i class="fas fa-trash"></i>
        </a>
        </div>
        </div>`);

        expenseList.append(parentDiv);
    };

    // using the reduce method to calculate the sum of expenses 
    function sumExpense() {
        let sum = 0;
        if (itemList.length > 0) {
            sum = itemList.reduce(function (a, b) {
                a += b.amount;
                return a;
            }, 0)
        }
        expenseAmount.text(sum);
        return sum;
    };

    //edit
    function editContent(e) {

        // remove child from DOM via accesing the parent,parent, parent element
        let dataId = parseInt(e.dataset.id);
        let grandParent = e.parentElement.parentElement.parentElement;
        expenseList.children(grandParent).remove();

        // remove item with the target ID from DOM i.e list
        let expenseFromList = itemList.filter(function (sample) {
            return sample.id === dataId;
        });

        // create a tamporary item to add list items that do not match the same ID of the target ID element
        let temp = itemList.filter(function (sample) {
            return sample.id != dataId;
        });

        // assign the remaining temporary list items to the itemList section, print the balance and get the element
        // with the corrsponding ID to the expense form for edit purposes
        itemList = temp;
        printTheBalance();
        expenseInput.val(expenseFromList[0].title);
        amountInput.val(expenseFromList[0].amount);
    };

    //delete
    function deleteContent(e) {
        let dataId = parseInt(e.dataset.id);
        let grandParent = e.parentElement.parentElement.parentElement;
        expenseList.children(grandParent).remove();

        let temp = itemList.filter(function (sample) {
            return sample.id != dataId;
        });

        itemList = temp;
        printTheBalance();
    };

    // event listener for budget form
    budgetForm.on('submit', function (e) {
        e.preventDefault();
        budgetFromSubmit();
    });

    // event listener for expense form
    expenseForm.on('submit', function (e) {
        e.preventDefault();
        expenseFormSubmit();
    });

    // event listener for expense list (edit & delete)
    expenseList.on('click', function (e) {
        e.preventDefault();
        if (e.target.parentElement.classList.contains('edit-icon')) {
            editContent(event.target.parentElement);
        } else if (e.target.parentElement.classList.contains('delete-icon')) {
            deleteContent(event.target.parentElement);
        }
    });

});
