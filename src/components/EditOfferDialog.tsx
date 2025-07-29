
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Advertisement } from "@/lib/types";

type Category = {
  value: string;
  label: string;
};

interface EditOfferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  offer: Advertisement;
  categories: Category[];
}

export default function EditOfferDialog({ isOpen, onClose, onSave, offer, categories }: EditOfferDialogProps) {
  const [offerName, setOfferName] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [appliesTo, setAppliesTo] = useState("categories");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (offer) {
      setOfferName(offer.text);
      
      const discountMatch = offer.discount?.match(/(\d+)(%?)/);
      if (discountMatch) {
        setDiscountValue(discountMatch[1] || "");
        setDiscountType(discountMatch[2] === '%' ? 'percentage' : 'fixed');
      } else {
        setDiscountValue("");
        setDiscountType("percentage");
      }

      if (offer.appliesTo?.toLowerCase().includes("categories")) {
        setAppliesTo("categories");
        // In a real app, you'd parse the categories from the offer.appliesTo string
        // For this prototype, we'll leave it simple.
        if (categories.length > 0) {
            setSelectedCategories([categories[0].value]);
        }
      } else if (offer.appliesTo?.toLowerCase().includes("products")) {
          setAppliesTo("products");
      } else {
        setAppliesTo("categories");
      }

      setIsActive(offer.status === 'Active');
    }
  }, [offer, categories]);

  const handleSave = () => {
    if (!offerName) {
      alert("Please fill in the Offer Name.");
      return;
    }
    onSave({
      text: offerName,
      discountType,
      discountValue,
      appliesTo,
      selectedCategories,
      isActive,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Offer</DialogTitle>
          <DialogDescription>
            Update the details for this offer.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="offer-name">Offer Name</Label>
            <Input
              id="offer-name"
              placeholder="e.g., 20% Off T-Shirts"
              value={offerName}
              onChange={(e) => setOfferName(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <RadioGroup
                className="flex items-center space-x-4 pt-2"
                onValueChange={setDiscountType}
                value={discountType}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="r1-edit" />
                  <Label htmlFor="r1-edit" className="font-normal">Percentage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="r2-edit" />
                  <Label htmlFor="r2-edit" className="font-normal">Fixed</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount-value">Discount Value</Label>
              <Input
                id="discount-value"
                type="number"
                placeholder="0"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Applies To</Label>
              <RadioGroup
                className="flex items-center space-x-4 pt-2"
                onValueChange={setAppliesTo}
                value={appliesTo}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="categories" id="r3-edit" />
                  <Label htmlFor="r3-edit" className="font-normal">Categories</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="products" id="r4-edit" />
                  <Label htmlFor="r4-edit" className="font-normal">Products</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>
                {appliesTo === 'categories' ? 'Select Categories' : 'Select Products'}
              </Label>
               <Select onValueChange={(value) => setSelectedCategories([value])} value={selectedCategories[0]}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${appliesTo.slice(0, -1)}...`} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <Switch id="offer-active-edit" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="offer-active-edit" className="font-normal">Offer is active</Label>
          </div>

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Offer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
