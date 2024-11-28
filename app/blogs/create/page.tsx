"use client";

import React, { Fragment, useState } from "react";

// COMPONENT
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// FORM HANDLER
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// SERVICE
import { createBlogService } from "@/services/blogServices";

// TOAST
import { useToast } from "@/hooks/use-toast";
import { ToastClose } from "@/components/ui/toast";

// DATE SETTER
import { id } from "date-fns/locale";
import { getAllCategoriesService } from "@/services/categoryServices";
import useSWR from "swr";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { Tiptap } from "@/components/tiptap/tiptap-editor";
import { blogStatus } from "@/schema/dataSchema";

const OPTIONS: Option[] = [
  { label: "Next", value: "next" },
  { label: "React", value: "react" },
  { label: "Remix", value: "remix" },
  { label: "Vite", value: "vite" },
  { label: "Nuxt", value: "nuxt" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
  { label: "Angular", value: "angular" },
  { label: "Gatsby", value: "gatsby" },
  { label: "Astro", value: "astro" },
  // { label: "Ember", value: "ember", disable: true },
];

// ENUM FOR STATUS BLOG
enum BlogStatus {
  DRAFT = "DRAFT",
  SEND = "SEND",
}

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

// BLOG SCHEMA
const newBlogSchema = z.object({
  title: z.string().min(3, { message: "Input with minimum 3 character" }),
  content: z.string().min(1, { message: "Content minimum 1 character" }),
  mainImageId: z.instanceof(File),
  status: z.nativeEnum(BlogStatus).optional(),
  allowComment: z.boolean().default(true).optional(),
  tag: z
    .array(optionSchema)
    .min(1, { message: "Input tag with minimun 1 tag" }),
  userId: z.string(),
  categoryId: z.string().min(1, { message: "Select minimum 1 option" }),
});

export default function CreateBlogPage() {
  // TOAST
  const { toast } = useToast();

  // IMAGE
  const [image, setImage] = useState<string | null>(null);

  // LOADING BUTTON
  const [loading, setLoading] = useState(false);

  // ALERT DIALOG
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // FORM HANDLER
  const defaultValues = {
    title: "Pengamat Politik UB : Waspadai Politik Uang di Masa Tenang",
    content:
      "<p>Pengamat Politik FISIP Universitas Brawijaya (UB) Wawan Sobari S.IP., MA., Ph.D. mengingatkan masyarakat untuk mewaspadai tim sukses (Timses) tingkat RT/RW melakukan politik uang di masa tenang.</p><p></p><p>“Saya analisa praktik politik uang di masa tenang tim sukses (Timses) tingkat RT/RW biasanya sering kali memanfaatkan itu dan berperan dalam praktik ini,” ucapnya, saat dikonfirmasi, Minggu (24/11/2024).</p><p></p><p>Menurut Wawan, modus praktik politik uang pada masa tenang, biasanya pemberian langsung dalam jumlah kecil. Hal itu dilakukan untuk menghindari deteksi dan memanfaatkan kebutuhan ekonomi masyarakat​.</p><p></p><p>Penyaluran melalui jejaring informal, seperti relawan, tokoh masyarakat, atau kepala desa, untuk mendistribusikan uang atau barang secara masif.</p><p></p><p>“Biasanya Timses tingkat RT/RW sering&nbsp; dimanfaatkan untuk memperluas distribusi​. Bantuan berupa sembako atau kebutuhan sehari-hari disalurkan melalui tokoh lokal atau acara komunitas​,” ungkapnya.</p><p></p><p>Sebab, lanjut Wawan, berdasarkan analisis pada 23 jurnal mengenai politik uang dalam pilkada dan laporan hasil survei berjudul ‘Peta Elektoral Pilkada Kota&nbsp; Malang dari Lembaga Survei Indonesia’. Kandidat memanfaatkan program bantuan sosial pemerintah sebagai sarana untuk menyisipkan agenda politik​ sangat dimungkinkan terjadi.</p><p></p><p>Jika dilihat dari beberapa kasus, program bantuan sosial bisa dijadikan sarana menyisipkan agenda politik. Dimana kegiatan simbolis seperti doa bersama atau pemberian sumbangan amal, sering digunakan untuk mengalihkan perhatian dari maksud sebenarnya​.</p><p></p><p>“Modus-modus ini menunjukkan bahwa praktik politik uang sudah beradaptasi dengan sistem pengawasan Pemilu,” jelasnya.</p><p></p><p>Wawan menjelaskan, pola ini merefleksikan tingginya kebutuhan akan strategi pencegahan berbasis intelijen, yang dapat mengidentifikasi jaringan distribusi dan memutus rantainya sebelum pelaksanaan.</p><p>“Solusi dari politik uang di masa tenang, melalui deteksi anomali dalam distribusi sumber daya atau komunikasi politik bisa menjadi pendekatan inovatif. Selain itu, transparansi dana kampanye harus diintegrasikan dengan audit yang lebih ketat untuk menghindari penggunaan dana ilegal,” pungkasnya.</p>",
    mainImageId: undefined,
    status: undefined,
    allowComment: true,
    // publishedAt: undefined,
    tag: undefined,
    userId: "cm3jb3f36000055qq6fckrve1",
    categoryId: "",
  };

  const form = useForm<z.infer<typeof newBlogSchema>>({
    resolver: zodResolver(newBlogSchema),
    defaultValues,
    shouldFocusError: false,
    mode: "all",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // SUBMIT FORM BUTTON
  const handleSubmitButtonClick = () => {
    setShowConfirmDialog(true);
  };

  // FUNC CONFIRM CREATE AFTER ALERT DIALOG
  const handleConfirmSubmit = () => {
    form.handleSubmit(onSubmit)();
    setShowConfirmDialog(false);
  };

  // CANCEL BUTTON
  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
  };

  // HANDLING SUBMIT FORM
  const onSubmit = async (values: z.infer<typeof newBlogSchema>) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("userId", values.userId);
      formData.append("status", values.status || BlogStatus.DRAFT);
      formData.append("allowComment", String(values.allowComment));
      formData.append("categoryId", values.categoryId);
      formData.append("mainImageId", values.mainImageId);
      if (values.tag && values.tag.length > 0) {
        const tags = values.tag.map((tag) => JSON.stringify(tag)); // Pastikan sesuai format backend
        formData.append("tag", JSON.stringify(tags)); // Bisa juga mengirim sebagai stringified array
      }
      // SEND TO API
      const result = await createBlogService(formData);

      // TOAST MESSAGE FROM API
      toast({
        description: result.message,
        action: <ToastClose />,
        duration: 4000,
      });

      // RESET FORM
      form.reset();
    } catch (error: any) {
      console.log(values);

      // ERROR HANDLER
      const errorMessage =
        error?.response?.data?.message || "An error occurred";

      // TOAST MESSAGE FROM API
      toast({
        description: errorMessage,
        variant: "destructive",
        action: <ToastClose />,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetcher = () => getAllCategoriesService();
  const { data, error, isLoading } = useSWR("/category", fetcher);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create A New Blog</CardTitle>
        <CardDescription>
          Share your ideas, stories or interesting information with the world!
          Fill in each section below with relevant details to create an engaging
          and informative blog. Make sure all input meets the requirements so
          that your blog is ready to be published.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="flex gap-4">
            <div className="w-3/4 flex flex-col gap-4">
              {/* TITLE */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Input your blog title here..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Enter the title of your blog here. Minimum of 3 characters
                      for better descriptiveness and appeal
                    </FormDescription>
                  </FormItem>
                )}
              />

              {/* MAIN IMAGE */}
              <FormField
                control={form.control}
                name="mainImageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Image</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        {/* Image Preview */}
                        {image ? (
                          <div className="relative w-full aspect-video rounded-md overflow-hidden">
                            <img
                              src={image}
                              alt="Preview"
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-full h-64 border border-dashed border-input rounded-md bg-background">
                            <span className="text-gray-400">
                              No image selected
                            </span>
                          </div>
                        )}
                        <Input
                          type="file"
                          accept="image/*"
                          name="mainImageId"
                          onChange={(e) => {
                            handleImageChange(e);
                            field.onChange(e.target.files?.[0]);
                          }}
                          placeholder="Upload your image"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Upload an image file (PNG, JPG, JPEG, or GIF) with a
                      maximum size of 2MB.
                    </FormDescription>
                  </FormItem>
                )}
              />

              {/* CONTENT */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Tiptap content={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Add the main content of your blog here. At least 1
                      characters are required to provide more information to
                      readers
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className="w-1/4 flex flex-col gap-4">
              {/* CATEGORY */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data!.map((item, index) => {
                          return (
                            <Fragment key={index}>
                              <SelectItem value={item.id}>
                                {item.name}
                              </SelectItem>
                            </Fragment>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <FormDescription>
                      Select an appropriate category for this blog. You must
                      choose at least one category
                    </FormDescription>
                  </FormItem>
                )}
              />

              {/* TAG */}
              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag</FormLabel>
                    <FormControl>
                      <MultipleSelector
                        {...field}
                        defaultOptions={OPTIONS}
                        placeholder="Input tag"
                        hidePlaceholderWhenSelected
                        creatable
                        emptyIndicator={
                          <p className="text-center leading-6 text-gray-600 dark:text-gray-400">
                            No results found
                          </p>
                        }
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Add a tag related to your blog to make it easier to find.
                      Minimum of 3 characters
                    </FormDescription>
                  </FormItem>
                )}
              />

              {/* DATE PICKER */}
              {/* <FormField
                control={form.control}
                name="publishedAt"
                render={({ field }) => (
                  <FormItem className="flex w-72 flex-col gap-2">
                    <FormLabel>Date Publish</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        displayFormat={{ hour24: "PPP HH:mm" }}
                        locale={id}
                        granularity="minute"
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Choose the desired date and time to publish this blog.
                      Adjust according to your schedule
                    </FormDescription>
                  </FormItem>
                )}
              /> */}

              {/* STATUS */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select Status"
                            defaultValue={"DRAFT"}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={BlogStatus.DRAFT}>
                          {BlogStatus.DRAFT}
                        </SelectItem>
                        <SelectItem value={BlogStatus.SEND}>
                          {BlogStatus.SEND}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <FormDescription>
                      Select the publication status: DRAFT for draft, SCHEDULE
                      to schedule, or PUBLISH to publish immediately
                    </FormDescription>
                  </FormItem>
                )}
              />
              {/* ALLOW COMMENT */}
              <FormField
                control={form.control}
                name="allowComment"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Allow users to comment
                      </FormLabel>
                      <FormDescription>
                        Check this box to allow users to comment on this blog,
                        or leave it unchecked to disable comments.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* SUBMIT */}

              <LoadingButton
                loading={loading}
                type="button"
                onClick={handleSubmitButtonClick}
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                Submit
              </LoadingButton>
            </div>

            <AlertDialog
              open={showConfirmDialog}
              onOpenChange={setShowConfirmDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Create Category</AlertDialogTitle>
                  <AlertDialogDescription>
                    Once the category is created, you can manage it by visiting
                    the blog categories list in the menu. Use this list to edit
                    or delete categories as needed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={handleConfirmCancel}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmSubmit}>
                    Confirm Create
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
