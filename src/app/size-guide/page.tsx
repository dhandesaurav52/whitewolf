
import { Metadata } from "next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = {
  title: 'Size Guide | White Wolf',
  description: 'Find your perfect fit with our detailed size guide for all our products.',
};

export default function SizeGuidePage() {
  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent mb-12 text-center">
            Size Guide
          </h1>
          <div className="space-y-12 text-base md:text-lg text-muted-foreground leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold font-headline text-accent mb-4">T-Shirts & Shirts</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Chest (in)</TableHead>
                    <TableHead>Length (in)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>S</TableCell>
                    <TableCell>36-38</TableCell>
                    <TableCell>28</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>M</TableCell>
                    <TableCell>38-40</TableCell>
                    <TableCell>29</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>L</TableCell>
                    <TableCell>40-42</TableCell>
                    <TableCell>30</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>XL</TableCell>
                    <TableCell>42-44</TableCell>
                    <TableCell>31</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div>
              <h2 className="text-2xl font-bold font-headline text-accent mb-4">Jeans & Trousers</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Waist (in)</TableHead>
                    <TableHead>Inseam (in)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>30</TableCell>
                    <TableCell>30-31</TableCell>
                    <TableCell>32</TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell>32</TableCell>
                    <TableCell>32-33</TableCell>
                    <TableCell>32</TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell>34</TableCell>
                    <TableCell>34-35</TableCell>
                    <TableCell>34</TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell>36</TableCell>
                    <TableCell>36-37</TableCell>
                    <TableCell>34</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
             <div className="pt-8 text-center">
              <h3 className="text-xl font-semibold text-primary">How to Measure</h3>
              <p className="mt-2">For the best fit, measure your body and compare it to the sizes above. If you're between sizes, we recommend sizing up for a more relaxed fit.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
