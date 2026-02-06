"use client";

type Props = {
  address: {
    name: string;
    street_address: string;
    province: string;
    district: string;
    postal_code: string;
    phone: string;
  };
  setAddress: React.Dispatch<React.SetStateAction<any>>;
};

export default function ShippingAddressList({ address, setAddress }: Props) {
  return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Delivery Address</h2>

        <input
            placeholder="Full Name"
            value={address.name}
            onChange={(e) =>
                setAddress({ ...address, name: e.target.value })
            }
            className="w-full border p-2 rounded"
        />

        <input
            placeholder="Street Address"
            value={address.street_address}
            onChange={(e) =>
                setAddress({ ...address, street_address: e.target.value })
            }
            className="w-full border p-2 rounded"
        />

        <input
            placeholder="Province"
            value={address.province}
            onChange={(e) =>
                setAddress({ ...address, province: e.target.value })
            }
            className="w-full border p-2 rounded"
        />

        <input
            placeholder="District"
            value={address.district}
            onChange={(e) =>
                setAddress({ ...address, district: e.target.value })
            }
            className="w-full border p-2 rounded"
        />

        <input
            placeholder="Postal Code"
            value={address.postal_code}
            onChange={(e) =>
                setAddress({ ...address, postal_code: e.target.value })
            }
            className="w-full border p-2 rounded"
        />

        <input
            placeholder="Phone Number"
            value={address.phone}
            onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
            }
            className="w-full border p-2 rounded"
        />
      </div>
  );
}
