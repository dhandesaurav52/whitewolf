"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SizeGuideDialogProps {
    isOpen: boolean;
    onClose: () => void;
    category: string;
}

const TShirtGuide = () => (
    <div>
        <h3 className="text-lg font-bold font-headline text-accent mb-2">👕 Men's T-Shirt Size Guide (India)</h3>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Chest (in)</TableHead>
                    <TableHead>Length (in)</TableHead>
                    <TableHead>Shoulder (in)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow><TableCell>S</TableCell><TableCell>36–38</TableCell><TableCell>26–27</TableCell><TableCell>16–17</TableCell></TableRow>
                <TableRow><TableCell>M</TableCell><TableCell>38–40</TableCell><TableCell>27–28</TableCell><TableCell>17–18</TableCell></TableRow>
                <TableRow><TableCell>L</TableCell><TableCell>40–42</TableCell><TableCell>28–29</TableCell><TableCell>18–19</TableCell></TableRow>
                <TableRow><TableCell>XL</TableCell><TableCell>42–44</TableCell><TableCell>29–30</TableCell><TableCell>19–20</TableCell></TableRow>
                <TableRow><TableCell>XXL</TableCell><TableCell>44–46</TableCell><TableCell>30–31</TableCell><TableCell>20–21</TableCell></TableRow>
            </TableBody>
        </Table>
    </div>
);

const ShirtGuide = () => (
    <div>
        <h3 className="text-lg font-bold font-headline text-accent mb-2">👔 Men's Shirt Size Guide (India)</h3>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Collar (in)</TableHead>
                    <TableHead>Chest (in)</TableHead>
                    <TableHead>Waist (in)</TableHead>
                    <TableHead>Sleeve (in)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow><TableCell>38 (S)</TableCell><TableCell>15</TableCell><TableCell>38</TableCell><TableCell>34</TableCell><TableCell>24.5</TableCell></TableRow>
                <TableRow><TableCell>39 (M)</TableCell><TableCell>15.5</TableCell><TableCell>40</TableCell><TableCell>36</TableCell><TableCell>25</TableCell></TableRow>
                <TableRow><TableCell>40 (L)</TableCell><TableCell>16</TableCell><TableCell>42</TableCell><TableCell>38</TableCell><TableCell>25.5</TableCell></TableRow>
                <TableRow><TableCell>42 (XL)</TableCell><TableCell>16.5</TableCell><TableCell>44</TableCell><TableCell>40</TableCell><TableCell>26</TableCell></TableRow>
                <TableRow><TableCell>44 (XXL)</TableCell><TableCell>17</TableCell><TableCell>46</TableCell><TableCell>42</TableCell><TableCell>26.5</TableCell></TableRow>
            </TableBody>
        </Table>
    </div>
);

const JeansGuide = () => (
    <div>
        <h3 className="text-lg font-bold font-headline text-accent mb-2">👖 Men’s Jeans Size Guide (India)</h3>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Waist (in)</TableHead>
                    <TableHead>Waist (cm)</TableHead>
                    <TableHead>Hips (in)</TableHead>
                    <TableHead>Inseam (in)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow><TableCell>28</TableCell><TableCell>71</TableCell><TableCell>34–35</TableCell><TableCell>30–32</TableCell></TableRow>
                <TableRow><TableCell>30</TableCell><TableCell>76</TableCell><TableCell>36–37</TableCell><TableCell>30–32</TableCell></TableRow>
                <TableRow><TableCell>32</TableCell><TableCell>81</TableCell><TableCell>38–39</TableCell><TableCell>31–33</TableCell></TableRow>
                <TableRow><TableCell>34</TableCell><TableCell>86</TableCell><TableCell>40–41</TableCell><TableCell>31–33</TableCell></TableRow>
                <TableRow><TableCell>36</TableCell><TableCell>91</TableCell><TableCell>42–43</TableCell><TableCell>31–34</TableCell></TableRow>
                <TableRow><TableCell>38</TableCell><TableCell>96</TableCell><TableCell>44–45</TableCell><TableCell>32–34</TableCell></TableRow>
                <TableRow><TableCell>40</TableCell><TableCell>101</TableCell><TableCell>46–47</TableCell><TableCell>32–35</TableCell></TableRow>
            </TableBody>
        </Table>
    </div>
);

const FootwearGuide = () => (
    <div>
        <h3 className="text-lg font-bold font-headline text-accent mb-2">👟 Men's Footwear Size Guide</h3>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>India</TableHead>
                    <TableHead>UK</TableHead>
                    <TableHead>US</TableHead>
                    <TableHead>Length (cm)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow><TableCell>6</TableCell><TableCell>6</TableCell><TableCell>7</TableCell><TableCell>24.5</TableCell></TableRow>
                <TableRow><TableCell>7</TableCell><TableCell>7</TableCell><TableCell>8</TableCell><TableCell>25.4</TableCell></TableRow>
                <TableRow><TableCell>8</TableCell><TableCell>8</TableCell><TableCell>9</TableCell><TableCell>26.3</TableCell></TableRow>
                <TableRow><TableCell>9</TableCell><TableCell>9</TableCell><TableCell>10</TableCell><TableCell>27.1</TableCell></TableRow>
                <TableRow><TableCell>10</TableCell><TableCell>10</TableCell><TableCell>11</TableCell><TableCell>27.9</TableCell></TableRow>
                <TableRow><TableCell>11</TableCell><TableCell>11</TableCell><TableCell>12</TableCell><TableCell>28.8</TableCell></TableRow>
                <TableRow><TableCell>12</TableCell><TableCell>12</TableCell><TableCell>13</TableCell><TableCell>29.6</TableCell></TableRow>
            </TableBody>
        </Table>
    </div>
);


export default function SizeGuideDialog({ isOpen, onClose, category }: SizeGuideDialogProps) {
    const lowerCategory = category.toLowerCase();
    
    let charts = [];
    
    if (lowerCategory.includes('t-shirt') || lowerCategory.includes('tee')) {
        charts.push(<TShirtGuide key="tshirt"/>);
    } else if (lowerCategory.includes('shirt')) {
        charts.push(<ShirtGuide key="shirt"/>);
    } else if (lowerCategory.includes('jeans') || lowerCategory.includes('trousers') || lowerCategory.includes('pants')) {
        charts.push(<JeansGuide key="jeans"/>);
    } else if (lowerCategory.includes('shoes')) {
        charts.push(<FootwearGuide key="footwear"/>);
    } else {
        charts.push(<TShirtGuide key="tshirt"/>, <ShirtGuide key="shirt"/>, <JeansGuide key="jeans"/>, <FootwearGuide key="footwear"/>);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Size Guide</DialogTitle>
                    <DialogDescription>
                        Find your perfect fit. Measurements are in inches unless specified.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-4">
                    <div className="space-y-6">
                        {charts.length > 0 ? charts.map((chart, index) => <div key={index}>{chart}</div>) : (
                            <div className="space-y-6">
                                <TShirtGuide/>
                                <ShirtGuide/>
                                <JeansGuide/>
                                <FootwearGuide/>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
