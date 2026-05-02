import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, X, ArrowLeft, Loader2 } from 'lucide-react';
import { Ingredient, Step } from '../types/recipe';

const BASE_URL = import.meta.env.VITE_API_URL;

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Vegetarian', 'Vegan', 'Quick & Easy'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

interface FormState {
  title: string;
  author: string;
  description: string;
  image: string;
  category: string;
  difficulty: string;
  cookTime: string;
  prepTime: string;
  servings: string;
  tags: string[];
  ingredients: Ingredient[];
  steps: Step[];
}

const empty: FormState = {
  title: '',
  author: '',
  description: '',
  image: '',
  category: '',
  difficulty: 'Easy',
  cookTime: '',
  prepTime: '',
  servings: '',
  tags: [],
  ingredients: [],
  steps: [],
};

const RecipeFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormState>(empty);
  const [tagInput, setTagInput] = useState('');
  const [ingredientRow, setIngredientRow] = useState<Ingredient>({ name: '', quantity: '', unit: '' });
  const [stepInput, setStepInput] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing recipe in edit mode
  useEffect(() => {
    if (!isEdit) return;
    fetch(`${BASE_URL}/api/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          title: data.title ?? '',
          author: data.author ?? '',
          description: data.description ?? '',
          image: data.image ?? '',
          category: data.category ?? '',
          difficulty: data.difficulty ?? 'Easy',
          cookTime: data.cookTime ?? '',
          prepTime: data.prepTime ?? '',
          servings: data.servings?.toString() ?? '',
          tags: data.tags ?? [],
          ingredients: data.ingredients ?? [],
          steps: (data.steps ?? []).sort((a: Step, b: Step) => a.order - b.order),
        });
      })
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Tags
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, t] }));
    }
    setTagInput('');
  };
  const removeTag = (tag: string) => setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));

  // Ingredients
  const addIngredient = () => {
    if (!ingredientRow.name.trim()) return;
    setForm((prev) => ({ ...prev, ingredients: [...prev.ingredients, { ...ingredientRow }] }));
    setIngredientRow({ name: '', quantity: '', unit: '' });
  };
  const removeIngredient = (i: number) =>
    setForm((prev) => ({ ...prev, ingredients: prev.ingredients.filter((_, idx) => idx !== i) }));

  // Steps
  const addStep = () => {
    const text = stepInput.trim();
    if (!text) return;
    setForm((prev) => ({
      ...prev,
      steps: [...prev.steps, { order: prev.steps.length + 1, instruction: text }],
    }));
    setStepInput('');
  };
  const removeStep = (i: number) =>
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, order: idx + 1 })),
    }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.author.trim()) e.author = 'Author name is required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const body = {
      ...form,
      servings: form.servings ? Number(form.servings) : undefined,
    };

    try {
      const url = isEdit ? `${BASE_URL}/api/recipes/${id}` : `${BASE_URL}/api/recipes`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save recipe');
      }
      const saved = await res.json();
      navigate(`/recipe/${saved._id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save recipe';
      setErrors({ submit: message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isEdit ? 'Edit Recipe' : 'Share a Recipe'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Basic Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={set('title')}
                  placeholder="e.g. Creamy Garlic Pasta"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${errors.title ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.author}
                  onChange={set('author')}
                  placeholder="e.g. Jamie Oliver"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${errors.author ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  rows={3}
                  placeholder="A short description of the recipe..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={set('image')}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
                {form.image && (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="mt-3 w-full h-40 object-cover rounded-xl"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>
            </div>
          </section>

          {/* Details */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={set('category')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={set('difficulty')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
                >
                  {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time</label>
                <input
                  type="text"
                  value={form.cookTime}
                  onChange={set('cookTime')}
                  placeholder="e.g. 30 min"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time</label>
                <input
                  type="text"
                  value={form.prepTime}
                  onChange={set('prepTime')}
                  placeholder="e.g. 10 min"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
                <input
                  type="number"
                  min="1"
                  value={form.servings}
                  onChange={set('servings')}
                  placeholder="e.g. 4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-orange-900">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  placeholder="e.g. Italian, Vegetarian"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2.5 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Ingredients */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Ingredients</h2>

            {form.ingredients.length > 0 && (
              <ul className="space-y-2 mb-4">
                {form.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                    <span className="text-gray-700">
                      {[ing.quantity, ing.unit, ing.name].filter(Boolean).join(' ')}
                    </span>
                    <button type="button" onClick={() => removeIngredient(i)} className="text-gray-400 hover:text-red-500">
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                placeholder="Qty (e.g. 2)"
                value={ingredientRow.quantity}
                onChange={(e) => setIngredientRow((r) => ({ ...r, quantity: e.target.value }))}
                className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              <input
                type="text"
                placeholder="Unit (e.g. cups)"
                value={ingredientRow.unit}
                onChange={(e) => setIngredientRow((r) => ({ ...r, unit: e.target.value }))}
                className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              <input
                type="text"
                placeholder="Ingredient *"
                value={ingredientRow.name}
                onChange={(e) => setIngredientRow((r) => ({ ...r, name: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addIngredient(); } }}
                className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              type="button"
              onClick={addIngredient}
              disabled={!ingredientRow.name.trim()}
              className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium disabled:opacity-40"
            >
              <Plus className="h-4 w-4" /> Add ingredient
            </button>
          </section>

          {/* Steps */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Instructions</h2>

            {form.steps.length > 0 && (
              <ol className="space-y-3 mb-4">
                {form.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="flex-1 text-gray-700 text-sm leading-relaxed">{step.instruction}</p>
                    <button type="button" onClick={() => removeStep(i)} className="text-gray-400 hover:text-red-500 mt-0.5">
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ol>
            )}

            <div className="flex gap-2">
              <textarea
                value={stepInput}
                onChange={(e) => setStepInput(e.target.value)}
                placeholder="Describe this step..."
                rows={2}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              />
              <button
                type="button"
                onClick={addStep}
                disabled={!stepInput.trim()}
                className="px-4 py-2.5 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition-colors disabled:opacity-40 self-start"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </section>

          {/* Submit */}
          {errors.submit && (
            <p className="text-red-500 text-sm text-center">{errors.submit}</p>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-4 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Share Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeFormPage;
