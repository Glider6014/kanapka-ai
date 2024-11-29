"use client";

import { Facebook, Twitter, Linkedin, Youtube, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <>
      <div className="bg-black text-white py-8">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 px-4 sm:px-6 lg:px-8">
          <div>
            <h3 className="font-bold text-sm uppercase mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>Recipe Generator</li>
              <li>Personalized Diet Plans</li>
              <li>Meal Planning</li>
              <li>Ingredient Database</li>
              <li>Nutrition Info</li>
              <li>Cooking Tips</li>
              <li>All Features</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase mb-4">Plans</h3>
            <ul className="space-y-2 text-sm">
              <li>Basic Plan</li>
              <li>Plus Plan</li>
              <li>Gold Plan</li>
              <li>Premium Plan</li>
              <li>Compare Plans</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>Recipes</li>
              <li>Blog</li>
              <li>Help Center</li>
              <li>FAQs</li>
              <li>Community Forum</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase mb-4">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>Events</li>
              <li>Partnerships</li>
              <li>Ambassadors</li>
              <li>User Stories</li>
              <li>Contributors</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4 justify-center md:justify-start">
              <Facebook />
              <Twitter />
              <Linkedin />
              <Youtube />
              <Instagram />
            </div>
            <div className="text-gray-500 flex gap-4 mt-4 md:mt-0 justify-center md:justify-start">
              <span>Privacy & Security</span>
              <span>Privacy Notice</span>
              <span>Terms of Use</span>
              <span>Trademarks</span>
              <span>Legal</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
