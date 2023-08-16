import container from "../../di/inversify.config";
import PaymentController from "./payment.controller";

export const paymentController = container.resolve<PaymentController>(PaymentController);
