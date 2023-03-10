package weshare.api.dto;

import org.junit.jupiter.api.Test;
import weshare.model.Expense;
import weshare.model.Payment;
import weshare.model.PaymentRequest;
import weshare.model.Person;

import javax.money.MonetaryAmount;

import static org.assertj.core.api.Assertions.assertThat;
import static weshare.model.DateHelper.DD_MM_YYYY;
import static weshare.model.DateHelper.TODAY;
import static weshare.model.MoneyHelper.amountOf;

public class PaymentDTOTests {
    @Test
    public void fromPayment() {
        MonetaryAmount R100 = amountOf(100);
        Person personWhoPaidForSomeone = new Person("ipaidforyou@wethinkcode.co.za");
        Person personWhoShouldPayBack = new Person("ioweyou@wethinkcode.co.za");
        Expense expense = new Expense(personWhoPaidForSomeone, "Airtime", R100, TODAY.minusDays(1));
        PaymentRequest paymentRequest = expense.requestPayment(personWhoShouldPayBack, R100, TODAY);
        Payment payment = paymentRequest.pay(personWhoShouldPayBack, TODAY);
        PaymentDTO dto = PaymentDTO.fromPayment(payment);

        assertThat(dto.getId()).isEqualTo(payment.getId());
        assertThat(dto.getExpenseId()).isEqualTo(payment.getExpenseForPersonPaying().getId());
        assertThat(dto.getPaymentRequestId()).isEqualTo(payment.getPaymentRequest().getId());
        assertThat(dto.getPayingPersonId()).isEqualTo(payment.getPersonPaying().getId());
        assertThat(dto.getAmount()).isEqualTo(payment.getAmountPaid().getNumber().longValue());
        assertThat(dto.getDate()).isEqualTo(DD_MM_YYYY.format(payment.getPaymentDate()));
    }
}
