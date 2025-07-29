
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type Category = {
  value: string;
  label: string;
};

interface CreateOfferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  categories: Category[];
}

export default function CreateOfferDialog({ isOpen, onClose, onSave, categories }: CreateOfferDialogProps) {
  const [offerName, setOfferName] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [appliesTo, setAppliesTo] = useState("categories");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  const handleSave = () => {
    if (!offerName || !discountValue) {
      alert("Please fill in Offer Name and Discount Value.");
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
          <DialogTitle className="text-2xl font-bold text-accent">Create New Offer</DialogTitle>
          <DialogDescription>
            Fill out the form to create a new promotional offer.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="offer-name" className="text-accent">Offer Name</Label>
            <Input
              id="offer-name"
              placeholder="e.g., 20% Off T-Shirts"
              value={offerName}
              onChange={(e) => setOfferName(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-accent">Discount Type</Label>
              <RadioGroup
                defaultValue="percentage"
                className="flex items-center space-x-4 pt-2"
                onValueChange={setDiscountType}
                value={discountType}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="r1" />
                  <Label htmlFor="r1">Percentage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="r2" />
                  <Label htmlFor="r2">Fixed</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount-value" className="text-accent">Discount Value</Label>
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
              <Label className="text-accent">Applies To</Label>
              <RadioGroup
                defaultValue="categories"
                className="flex items-center space-x-4 pt-2"
                onValueChange={setAppliesTo}
                value={appliesTo}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="categories" id="r3" />
                  <Label htmlFor="r3">Categories</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="products" id="r4" />
                  <Label htmlFor="r4">Products</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-accent">
                {appliesTo === 'categories' ? 'Select Categories' : 'Select Products'}
              </Label>
               <Select onValueChange={(value) => setSelectedCategories([value])}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${appliesTo}...`} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch id="offer-active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="offer-active">Offer is active</Label>
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
