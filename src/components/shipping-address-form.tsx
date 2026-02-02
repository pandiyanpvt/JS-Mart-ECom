"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { provinces } from "@/utils/provinces";
import { districts } from "@/utils/districts";
import { ErrorMessage, Field, Label } from "@/components/ui/fieldset";
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxLabel, ComboboxOption } from "@/components/ui/combobox";

interface Address {
  id?: string;
  name: string;
  phone: string;
  street_address: string;
  province: string;
  district: string;
  postal_code: string;
  is_default?: boolean;
}

interface ShippingInformationProps {
  title: string;
  action?: "create" | "edit";
  onSave?: (formData: Address, callback: () => void) => void;
  addressToEdit?: Address | null;
  onClose: () => void;
}

const AddShippingAddressPage: React.FC<ShippingInformationProps> = ({
                                                                      title,
                                                                      action,
                                                                      onSave,
                                                                      addressToEdit,
                                                                      onClose,
                                                                    }) => {
  const [address, setAddress] = useState<Address>(
      addressToEdit || {
        name: "",
        phone: "",
        street_address: "",
        province: "",
        district: "",
        postal_code: "",
      }
  );

  const [open, setOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = () => {
    // simple validation for frontend only
    const errors: Record<string, string> = {};
    if (!address.name) errors.name = "Name is required";
    if (!address.phone) errors.phone = "Phone is required";
    if (!address.street_address) errors.street_address = "Street is required";
    if (!address.province) errors.province = "Province is required";
    if (!address.district) errors.district = "District is required";
    if (!address.postal_code) errors.postal_code = "Postal code is required";

    setFormErrors(errors);

    if (Object.keys(errors).length === 0 && onSave) {
      onSave(address, onClose);
    }
  };

  const handleCancel = () => onClose();

  const filteredDistricts = districts.filter(
      (district) => district.provinceCode === address.province
  );

  return (
      <Dialog open={open} onClose={handleCancel} size="7xl">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription></DialogDescription>
        <DialogBody>
          <div className="pt-6 border-t border-gray-200">
            <div className="space-y-6">
              {/* Contact info */}
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                  Contact information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <Field className="col-span-2">
                    <Label>Contact name</Label>
                    <Input
                        value={address.name}
                        onChange={(e) => handleAddressChange("name", e.target.value)}
                        placeholder="Enter the contact name"
                        invalid={!!formErrors.name}
                    />
                    {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
                  </Field>

                  <Field className="col-span-2">
                    <Label>Phone number</Label>
                    <Input
                        value={address.phone}
                        onChange={(e) => handleAddressChange("phone", e.target.value)}
                        placeholder="Enter the phone"
                        invalid={!!formErrors.phone}
                    />
                    {formErrors.phone && <ErrorMessage>{formErrors.phone}</ErrorMessage>}
                  </Field>
                </div>
              </div>

              {/* Address */}
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Field className="col-span-2">
                    <Label>Street address</Label>
                    <Input
                        value={address.street_address}
                        onChange={(e) =>
                            handleAddressChange("street_address", e.target.value)
                        }
                        placeholder="Enter street address"
                        invalid={!!formErrors.street_address}
                    />
                    {formErrors.street_address && (
                        <ErrorMessage>{formErrors.street_address}</ErrorMessage>
                    )}
                  </Field>

                  <Field>
                    <Label>State / Province</Label>
                      <Combobox<typeof provinces[0]>
                          name="provinces"
                          placeholder="Select a province…"
                          options={provinces}
                          displayValue={(province) => province.name}
                          value={provinces.find((p) => p.provinceCode === address.province)}
                          onChange={(value) => {
                              handleAddressChange("province", value?.provinceCode || "");
                              handleAddressChange("district", "");
                          }}
                      >
                          {(province) => (
                              <ComboboxOption<typeof provinces[0]> value={province}>
                                  <ComboboxLabel>{province.name}</ComboboxLabel>
                              </ComboboxOption>
                          )}
                      </Combobox>

                      {formErrors.province && <ErrorMessage>{formErrors.province}</ErrorMessage>}
                  </Field>

                  <Field>
                    <Label>District</Label>
                      <Combobox<typeof districts[0]>
                          key={address.province}
                          options={filteredDistricts}
                          displayValue={(district) => district.name}
                          value={filteredDistricts.find((d) => d.districtCode === address.district)}
                          onChange={(value) => handleAddressChange("district", value?.districtCode || "")}
                      >
                          {(district) => (
                              <ComboboxOption<typeof districts[0]> value={district}>
                                  <ComboboxLabel>{district.name}</ComboboxLabel>
                              </ComboboxOption>
                          )}
                      </Combobox>
                    {formErrors.district && <ErrorMessage>{formErrors.district}</ErrorMessage>}
                  </Field>

                  <Field className="col-span-2">
                    <Label>Postal code</Label>
                    <Input
                        value={address.postal_code}
                        onChange={(e) => handleAddressChange("postal_code", e.target.value)}
                        placeholder="Enter postal code"
                        invalid={!!formErrors.postal_code}
                    />
                    {formErrors.postal_code && <ErrorMessage>{formErrors.postal_code}</ErrorMessage>}
                  </Field>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>

        <div className="mt-8 pb-1 flex items-center gap-2 justify-end">
          <Button type="button" onClick={handleCancel} color="white">
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} color="cyan">
            {action === "create" ? "Save" : "Update"}
          </Button>
        </div>
      </Dialog>
  );
};

export default AddShippingAddressPage;
