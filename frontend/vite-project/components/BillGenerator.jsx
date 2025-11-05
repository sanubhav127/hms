import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import { Receipt, XCircle } from "lucide-react";

const BillGenerator = ({ isOpen, onClose, appointment }) => {
  const [bill, setBill] = useState({
    consultationFee: 500,
    medicineCharges: 0,
    testCharges: 0,
    totalAmount: 500,
    _id: null,
  });
  const [loading, setLoading] = useState(false);

  // Auto calculate total
  useEffect(() => {
    setBill((prev) => ({
      ...prev,
      totalAmount:
        (Number(prev.consultationFee) || 0) +
        (Number(prev.medicineCharges) || 0) +
        (Number(prev.testCharges) || 0),
    }));
  }, [bill.consultationFee, bill.medicineCharges, bill.testCharges]);

  // Fetch existing bill (if any)
  useEffect(() => {
    if (!appointment?._id) return;
    const fetchBill = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/bill/${appointment._id}`, {
          withCredentials: true,
        });
        const bills = res.data?.bill || res.data;
        /*const existing = bills.find(
          (b) => b.appointmentId?._id === appointment._id
        );*/
        if (bills) {
          setBill({
            consultationFee: bills.consultationFee,
            medicineCharges: bills.medicineCharges,
            testCharges: bills.testCharges,
            totalAmount: bills.totalAmount,
            _id: bills._id,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBill();
  }, [appointment]);

  const handleSaveBill = async () => {
    try {
      setLoading(true);

      if (!appointment?._id) {
        toast.error("Invalid appointment data");
        return;
      }

      // If bill exists, update it; else create new one
      if (bill._id) {
        await axios.put(
          `http://localhost:3000/api/bill/${bill._id}`,
          {
            patientId: appointment.patient?._id,
            doctorId: appointment.doctor?._id,
            appointmentId: appointment._id,
            consultationFee: bill.consultationFee,
            medicineCharges: bill.medicineCharges,
            testCharges: bill.testCharges,
            totalAmount: bill.totalAmount,
            status: "Paid"
          },
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `http://localhost:3000/api/bill/create`,
          {
            patientId: appointment.patient?._id,
            doctorId: appointment.doctor?._id,
            appointmentId: appointment._id,
            consultationFee: bill.consultationFee,
            medicineCharges: bill.medicineCharges,
            testCharges: bill.testCharges,
            totalAmount: bill.totalAmount,
            status: "Paid",
          },
          { withCredentials: true }
        );
      }

      toast.success("Bill saved and marked as Paid!");
      onClose(); // close modal
    } catch (err) {
      console.error(err);
      toast.error("Error saving bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => !loading && onClose()}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-semibold text-blue-700 flex items-center gap-2">
                    <Receipt /> Billing for Appointment
                  </h3>
                  <button
                    onClick={() => !loading && onClose()}
                    className="text-gray-500 hover:text-red-600 transition"
                  >
                    <XCircle size={28} />
                  </button>
                </div>

                {/* PATIENT INFO */}
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 font-semibold">
                    Patient:{" "}
                    <span className="font-normal">
                      {appointment?.patient?.name}
                    </span>
                  </p>
                  <p className="text-gray-700 font-semibold">
                    Doctor:{" "}
                    <span className="font-normal">
                      {appointment?.doctor?.fullname}
                    </span>
                  </p>
                  <p className="text-gray-700 font-semibold">
                    Date:{" "}
                    <span className="font-normal">
                      {new Date(
                        appointment?.appointmentDate
                      ).toLocaleString()}
                    </span>
                  </p>
                </div>

                {/* BILLING FORM */}
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-gray-700">
                      Consultation Fee
                    </label>
                    <input
                      type="number"
                      value={bill.consultationFee}
                      onChange={(e) =>
                        setBill({
                          ...bill,
                          consultationFee: Number(e.target.value),
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700">
                      Medicine Charges
                    </label>
                    <input
                      type="number"
                      value={bill.medicineCharges}
                      onChange={(e) =>
                        setBill({
                          ...bill,
                          medicineCharges: Number(e.target.value),
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700">
                      Test Charges
                    </label>
                    <input
                      type="number"
                      value={bill.testCharges}
                      onChange={(e) =>
                        setBill({
                          ...bill,
                          testCharges: Number(e.target.value),
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                    />
                  </div>

                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <h4 className="text-xl font-bold text-green-700">
                      Total: ₹{bill.totalAmount}
                    </h4>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => !loading && onClose()}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBill}
                    disabled={loading}
                    className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:scale-105 transition"
                  >
                    {loading ? "Processing..." : "Save & Mark Paid"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BillGenerator;